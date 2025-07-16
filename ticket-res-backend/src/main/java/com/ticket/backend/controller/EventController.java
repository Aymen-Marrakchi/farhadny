package com.ticket.backend.controller;


import com.ticket.backend.dto.EventDTO;
import com.ticket.backend.model.Event;
import com.ticket.backend.model.EventCategory;
import com.ticket.backend.security.services.UserDetailsImpl;
import com.ticket.backend.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:4200")
public class EventController {
    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents() {
        List<EventDTO> events = eventService.getAllEvents().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id) {
        Event event;
        event = eventService.getEventById(id);
        if (event == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(convertToDto(event), HttpStatus.OK);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventDTO>> getUpcomingEvents() {
        List<EventDTO> events = eventService.getUpcomingEvents().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/category")
    public ResponseEntity<List<EventDTO>> getEventsByCategories(@RequestParam List<EventCategory> categories) {
        List<EventDTO> events = eventService.getEventsByCategoriesIn(categories).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(events, HttpStatus.OK);
    }



    @GetMapping("/past")
    public ResponseEntity<List<EventDTO>> getPastEvents() {
        List<EventDTO> events = eventService.getPastEvents().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventDTO>> searchEventsByTitle(@RequestParam String title) {
        List<EventDTO> events = eventService.searchEventsByTitle(title).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@Valid @RequestBody EventDTO eventDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        Long currentUserId = null;
        if (principal instanceof UserDetailsImpl) {
            currentUserId = ((UserDetailsImpl) principal).getId();
        } else {
            System.err.println("Warning: Principal is not UserDetailsImpl. Falling back to username/email as creatorId for event creation: " + authentication.getName());
        }

        Event event = convertToEntity(eventDTO);
        event.setCreatorId(currentUserId);

        Event createdEvent = eventService.createEvent(event);
        return new ResponseEntity<>(convertToDto(createdEvent), HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Long id, @Valid @RequestBody EventDTO eventDTO) {
        Event existingEvent = eventService.getEventById(id);
        if (existingEvent == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Event eventToUpdate = convertToEntity(eventDTO);
        eventToUpdate.setId(id);

        if (eventDTO.getCreatorId() == null) {
            if (existingEvent.getCreatorId() != null) {
                eventToUpdate.setCreatorId(existingEvent.getCreatorId());
            } else {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                Object principal = authentication.getPrincipal();

                Long currentUserIdForUpdate = null;
                if (principal instanceof UserDetailsImpl) {
                    currentUserIdForUpdate = ((UserDetailsImpl) principal).getId();
                } else {
                    System.err.println("Warning: Principal is not UserDetailsImpl during event update (for null creatorId). Falling back to username/email: " + authentication.getName());
                }
                eventToUpdate.setCreatorId(currentUserIdForUpdate);
            }
        }

        Event updatedEvent = eventService.updateEvent(id, eventToUpdate);
        return new ResponseEntity<>(convertToDto(updatedEvent), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/{id}/tickets-sold")
    public ResponseEntity<Integer> getTicketsSoldForEvent(@PathVariable Long id) {
        int ticketsSold = eventService.getTotalTicketsSoldForEvent(id);
        return new ResponseEntity<>(ticketsSold, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority( 'SUPER_ADMIN')")
    @GetMapping("/stats/total-tickets-sold/all")
    public ResponseEntity<Long> getTotalTicketsSoldAcrossAllEvents() {
        long total = eventService.getTotalTicketsSoldAcrossAllEvents();
        return new ResponseEntity<>(total, HttpStatus.OK);
    }
    @PreAuthorize("(hasAuthority('ADMIN') and #creatorId == authentication.principal.id)")
    @GetMapping("/stats/total-tickets-sold/by-creator/{creatorId}")
    public ResponseEntity<Long> getTotalTicketsSoldByCreator(@PathVariable Long creatorId) {
        long total = eventService.getTotalTicketsSoldByCreator(creatorId);
        return ResponseEntity.ok(total);
    }
    @PreAuthorize("hasAuthority('SUPER_ADMIN') or (hasAuthority('ADMIN') and #creatorId == authentication.principal.id)")
    @GetMapping("/stats/total-revenue/by-creator/{creatorId}")
    public ResponseEntity<Double> getTotalRevenueByCreator(@PathVariable Long creatorId) {
        double totalRevenue = eventService.getTotalRevenueByCreator(creatorId);
        return ResponseEntity.ok(totalRevenue);
    }

    private EventDTO convertToDto(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setEventDateTime(event.getEventDateTime());
        dto.setLocation(event.getLocation());
        dto.setImageUrl(event.getImageUrl());
        dto.setCategories(event.getCategories());
        dto.setPrice(event.getPrice());
        dto.setTotalTickets(event.getTotalTickets());
        dto.setTicketsSold(event.getTicketsSold());
        dto.setCreatorId(event.getCreatorId());
        return dto;
    }

    private Event convertToEntity(EventDTO eventDTO) {
        Event event = new Event();
        if (eventDTO.getId() != null) {
            event.setId(eventDTO.getId());
        }
        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setEventDateTime(eventDTO.getEventDateTime());
        event.setLocation(eventDTO.getLocation());
        event.setImageUrl(eventDTO.getImageUrl());
        event.setCategories(eventDTO.getCategories());
        event.setPrice(eventDTO.getPrice());
        event.setTotalTickets(eventDTO.getTotalTickets());
        event.setTicketsSold(eventDTO.getTicketsSold() != null ? eventDTO.getTicketsSold() : 0);
        event.setCreatorId(eventDTO.getCreatorId());
        return event;
    }
}
