package edu.ucsb.cs156.example.controllers;


import edu.ucsb.cs156.example.entities.MenuItemReview;
import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.MenuItemReviewRepository;
import edu.ucsb.cs156.example.repositories.UCSBDateRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import java.time.LocalDateTime;

@Tag(name = "MenuItemReview")
@RequestMapping("/api/menuitemreview")
@RestController
@Slf4j
public class MenuItemReviewController extends ApiController {
    @Autowired
    MenuItemReviewRepository menuItemReviewRepository; 

    /**
     * List all Menu Item Reviews
     * 
     * @return an iterable of MenuItemRevire
     */
    @Operation(summary= "List all menu item reviews")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<MenuItemReview> allMenuItemReviews() {
        Iterable<MenuItemReview> reviews = menuItemReviewRepository.findAll();
        return reviews;
    }

    /**
     * Create a new review
     * 
     * @param itemId         
     * @param reviewerEmail 
     * @param stars 
     * @param localDateTime 
     * @param comments 
     * @return the saved review
     */

    @Operation(summary= "Create a new review")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public MenuItemReview postMenuItemReview(
            @Parameter(name="itemId") @RequestParam Long itemId,
            @Parameter(name="reviewerEmail") @RequestParam String reviewerEmail,
            @Parameter(name="stars") @RequestParam int stars,
            @Parameter(name="localDateTime", description="date (in iso format, e.g. YYYY-mm-ddTHH:MM:SS; see https://en.wikipedia.org/wiki/ISO_8601)") @RequestParam("localDateTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime localDateTime,
            @Parameter(name="comments") @RequestParam String comments)
            throws JsonProcessingException {

        // For an explanation of @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
        // See: https://www.baeldung.com/spring-date-parameters

        log.info("localDateTime={}", localDateTime);

        MenuItemReview review = new MenuItemReview();
        review.setItemid(itemId);
        review.setRevieweremail(reviewerEmail);
        review.setStars(stars);
        review.setDatereviewed(localDateTime);
        review.setComments(comments);
        MenuItemReview savedReview = menuItemReviewRepository.save(review);

        return savedReview;
    }

    /**
     * Get a single review by id
     * 
     * @param id the id of the review
     * @return a MenuItemReview 
     */
    @Operation(summary= "Get a single review")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public MenuItemReview getById(@Parameter(name="id") @RequestParam Long id) {
        MenuItemReview review = menuItemReviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MenuItemReview.class, id));

        return review;
    }
    
    /**
     * Delete a UCSBDate
     * 
     * @param id the id of the date to delete
     * @return a message indicating the date was deleted
     */
    @Operation(summary= "Delete a MenuReviewItem")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteMenuItemReview(
            @Parameter(name="id") @RequestParam Long id) {
        MenuItemReview review = menuItemReviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MenuItemReview.class, id));

        menuItemReviewRepository.delete(review);
        return genericMessage("MenuItemReview with id %s deleted".formatted(id));
    }

    /**
     * Update a single review
     * 
     * @param id       id of the review to update
     * @param incoming the new review
     * @return the updated review object
     */
    @Operation(summary= "Update a single review")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public MenuItemReview updateMenuItemReview(
            @Parameter(name="id") @RequestParam Long id,
            @RequestBody @Valid MenuItemReview incoming) {

        MenuItemReview review = menuItemReviewRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MenuItemReview.class, id));

        review.setItemid(incoming.getItemid());
        review.setRevieweremail(incoming.getRevieweremail());
        review.setStars(incoming.getStars());
        review.setDatereviewed(incoming.getDatereviewed());
        review.setComments(incoming.getComments());

        menuItemReviewRepository.save(review);

        return review;
    }
}
