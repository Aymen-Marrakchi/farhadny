package com.ticket.backend.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.ticket.backend.model.EventCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    @NotNull(message = "Event date and time are required")
    @FutureOrPresent(message = "Event date and time must be in the present or future")
    private LocalDateTime eventDateTime;

    private String imageUrl;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "event_categories", joinColumns = @JoinColumn(name = "event_id"))
    @NotNull(message = "Event categories are required")
    private List<EventCategory> categories;


    @NotNull(message = "Price is required")
    private Double price;

    @NotNull(message = "Total tickets are required")
    private Integer totalTickets;

    private Integer ticketsSold;

    private Long creatorId;
}
