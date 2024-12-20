package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.Articles;
import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.repositories.ArticlesRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = ArticlesController.class)
@Import(TestConfig.class)
public class ArticlesControllerTests extends ControllerTestCase {

        @MockBean
        ArticlesRepository ArticlesRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for /api/ucsbdates/admin/all

        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/articles/all"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_users_can_get_all() throws Exception {
                mockMvc.perform(get("/api/articles/all"))
                                .andExpect(status().is(200)); // logged
        }

        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/articles?id=1"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        // Authorization tests for /api/articles/post
        // (Perhaps should also have these for put and delete)

        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/articles/post"))
                                .andExpect(status().is(403));
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_regular_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/articles/post"))
                                .andExpect(status().is(403)); // only admins can post
        }

        // Tests with mocks for database actions

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {

                // arrange
                LocalDateTime ldt = LocalDateTime.parse("2022-01-03T00:00:00");

                Articles article = Articles.builder()
                                .title("Articles1") // Updated from "Article1"
                                .url("url1")
                                .explanation("explanation1")
                                .email("email1")    
                                .dateadded(ldt)
                                .build();

                when(ArticlesRepository.findById(eq(1L))).thenReturn(Optional.of(article));

                // act
                MvcResult response = mockMvc.perform(get("/api/articles?id=1"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ArticlesRepository, times(1)).findById(eq(1L));
                String expectedJson = mapper.writeValueAsString(article);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "USER" })
        @Test
        public void test_that_logged_in_user_can_get_by_id_when_the_id_does_not_exist() throws Exception {

                // arrange

                when(ArticlesRepository.findById(eq(1L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(get("/api/articles?id=1"))
                                .andExpect(status().isNotFound()).andReturn();

                // assert

                verify(ArticlesRepository, times(1)).findById(eq(1L));
                Map<String, Object> json = responseToJson(response);
                assertEquals("EntityNotFoundException", json.get("type"));
                assertEquals("Articles with id 1 not found", json.get("message"));
        }


        @WithMockUser(roles = { "USER" })
        @Test
        public void logged_in_user_can_get_all_articles() throws Exception {

                // arrange
                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                Articles articles1 = Articles.builder()
                                .title("Articles1") // Updated from "Article1"
                                .url("url1")
                                .explanation("explanation1")
                                .email("email1")    
                                .dateadded(ldt1)
                                .build();


                LocalDateTime ldt2 = LocalDateTime.parse("2022-03-11T00:00:00");

                Articles articles2 = Articles.builder()
                                .title("Articles2")
                                .url("url2")
                                .explanation("explanation2")
                                .email("email2")    
                                .dateadded(ldt2)
                                .build();

                ArrayList<Articles> expectedDates = new ArrayList<>();
                expectedDates.addAll(Arrays.asList(articles1, articles2));

                when(ArticlesRepository.findAll()).thenReturn(expectedDates);

                // act
                MvcResult response = mockMvc.perform(get("/api/articles/all"))
                                .andExpect(status().isOk()).andReturn();

                // assert

                verify(ArticlesRepository, times(1)).findAll();
                String expectedJson = mapper.writeValueAsString(expectedDates);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void an_admin_user_can_post_a_new_articles() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                Articles articles1 = Articles.builder()
                                .title("Articles1")
                                .url("url1")
                                .explanation("explanation1")
                                .email("email1")    
                                .dateadded(ldt1)
                                .build();

                when(ArticlesRepository.save(eq(articles1))).thenReturn(articles1);

                // act
                MvcResult response = mockMvc.perform(
                                post("/api/articles/post?title=Articles1&url=url1&explanation=explanation1&email=email1&dateadded=2022-01-03T00:00:00")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ArticlesRepository, times(1)).save(articles1);
                String expectedJson = mapper.writeValueAsString(articles1);
                String responseString = response.getResponse().getContentAsString();
                assertEquals(expectedJson, responseString);
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_delete_a_date() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                Articles article1 = Articles.builder()
                                .title("Articles1")
                                .url("url1")
                                .explanation("explanation1")
                                .email("email1")    
                                .dateadded(ldt1)
                                .build();

                when(ArticlesRepository.findById(eq(15L))).thenReturn(Optional.of(article1));

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/articles?id=15")
                                                .with(csrf()))
                                .andExpect(status().isOk()).andReturn();

                // assert
                verify(ArticlesRepository, times(1)).findById(15L);
                verify(ArticlesRepository, times(1)).delete(any());

                Map<String, Object> json = responseToJson(response);
                assertEquals("Articles with id 15 deleted", json.get("message"));
        }

        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_tries_to_delete_non_existant_articles_and_gets_right_error_message()
                        throws Exception {
                // arrange

                when(ArticlesRepository.findById(eq(15L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                delete("/api/articles?id=15")
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ArticlesRepository, times(1)).findById(15L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Articles with id 15 not found", json.get("message"));
        }


        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_can_edit_an_existing_article() throws Exception {
            // arrange

            LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");
            LocalDateTime ldt2 = LocalDateTime.parse("2023-01-03T00:00:00");

            Articles articleOrig = Articles.builder()
                            .title("Articles1")
                            .url("url1")
                            .explanation("explanation1")
                            .email("email1")
                            .dateadded(ldt1)
                            .build();

            Articles articleEdited = Articles.builder()
                            .title("Updated Article")
                            .url("updated-url")
                            .explanation("Updated explanation")
                            .email("updated-email")
                            .dateadded(ldt2)
                            .build();

            String requestBody = mapper.writeValueAsString(articleEdited);

            when(ArticlesRepository.findById(eq(1L))).thenReturn(Optional.of(articleOrig));
            when(ArticlesRepository.save(any(Articles.class))).thenReturn(articleOrig);

            // act
            MvcResult response = mockMvc.perform(
                            put("/api/articles?id=1")
                                            .contentType(MediaType.APPLICATION_JSON)
                                            .characterEncoding("utf-8")
                                            .content(requestBody)
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(ArticlesRepository, times(1)).findById(1L);
            verify(ArticlesRepository, times(1)).save(articleOrig);
            
            // Verify that the original article's fields were updated
            assertEquals("Updated Article", articleOrig.getTitle());
            assertEquals("updated-url", articleOrig.getUrl());
            assertEquals("Updated explanation", articleOrig.getExplanation());
            assertEquals("updated-email", articleOrig.getEmail());
            assertEquals(ldt2, articleOrig.getDateadded());

            String responseString = response.getResponse().getContentAsString();
            Articles responseArticle = mapper.readValue(responseString, Articles.class);

            // Check that the response matches the expected values
            assertEquals("Updated Article", responseArticle.getTitle());
            assertEquals("updated-url", responseArticle.getUrl());
            assertEquals("Updated explanation", responseArticle.getExplanation());
            assertEquals("updated-email", responseArticle.getEmail());
            assertEquals(ldt2, responseArticle.getDateadded());
        }


        @WithMockUser(roles = { "ADMIN", "USER" })
        @Test
        public void admin_cannot_edit_article_that_does_not_exist() throws Exception {
                // arrange

                LocalDateTime ldt1 = LocalDateTime.parse("2022-01-03T00:00:00");

                Articles ArticlesEditedTime = Articles.builder()
                                .title("Articles1")
                                .url("url1")
                                .explanation("explanation1")
                                .email("email1")    
                                .dateadded(ldt1)
                                .build();

                String requestBody = mapper.writeValueAsString(ArticlesEditedTime);

                when(ArticlesRepository.findById(eq(7L))).thenReturn(Optional.empty());

                // act
                MvcResult response = mockMvc.perform(
                                put("/api/articles?id=7")
                                                .contentType(MediaType.APPLICATION_JSON)
                                                .characterEncoding("utf-8")
                                                .content(requestBody)
                                                .with(csrf()))
                                .andExpect(status().isNotFound()).andReturn();

                // assert
                verify(ArticlesRepository, times(1)).findById(7L);
                Map<String, Object> json = responseToJson(response);
                assertEquals("Articles with id 7 not found", json.get("message"));

        }
        
}
