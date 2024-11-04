package edu.ucsb.cs156.example.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "menuitemreview")
public class MenuItemReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    Long itemid;
    String revieweremail;
    int stars;
    LocalDateTime datereviewed;
    String comments;
}
