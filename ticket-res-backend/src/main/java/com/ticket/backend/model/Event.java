package com.ticket.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String location;

    private String imageUrl;

    @Column(nullable = false)
    private LocalDateTime eventDateTime;

    @ElementCollection(targetClass = EventCategory.class)
    @CollectionTable(name = "event_categories", joinColumns = @JoinColumn(name = "event_id"))
    @Enumerated(EnumType.STRING)
    private List<EventCategory> categories;

    @Column(nullable = false)
    private Double price;
    @Column(nullable = false)
    private Integer totalTickets;
    private Integer ticketsSold = 0;

    @Column(nullable = true)
    private Long creatorId;
}
