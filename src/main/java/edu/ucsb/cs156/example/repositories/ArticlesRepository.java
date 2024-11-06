package edu.ucsb.cs156.example.repositories;

import edu.ucsb.cs156.example.entities.Articles;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * The ArticlesRepository is a repository for Articles entities.
 */

@Repository
public interface ArticlesRepository extends CrudRepository<Articles, Long> {
  /**
   * This method returns all Articles entities with a given email.
   * @param email quarter in the format YYYYQ (e.g. 20241 for Winter 2024, 20242 for Spring 2024, 20243 for Summer 2024, 20244 for Fall 2024)
   * @return all Articles entities with a given email
   */
  Iterable<Articles> findAllByEmail(String email);
}