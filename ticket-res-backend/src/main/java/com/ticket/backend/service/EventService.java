package com.ticket.backend.service;

import com.ticket.backend.model.Event;
import com.ticket.backend.model.EventCategory;
import com.ticket.backend.model.Ticket;
import com.ticket.backend.repository.EventRepository;
import com.ticket.backend.repository.TicketRepository;
import jdk.jfr.Category;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;
    public EventService(EventRepository eventRepository, TicketRepository ticketRepository) {
        this.eventRepository = eventRepository;
        this.ticketRepository = ticketRepository;
    }
    public Event createEvent(Event event){
        event.setTicketsSold(0);
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }


    public List<Event> getEventsByCategoriesIn( List<EventCategory> categories) {
        return eventRepository.findByCategoriesIn(categories);
    }


    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByEventDateTimeAfterOrderByEventDateTimeAsc(LocalDateTime.now());
    }

    public List<Event> getPastEvents() {
        return eventRepository.findByEventDateTimeBeforeOrderByEventDateTimeDesc(LocalDateTime.now());
    }

    public Event updateEvent(Long id, Event updatedEventData) {
        return eventRepository.findById(id).map(event -> {
            event.setTitle(updatedEventData.getTitle());
            event.setDescription(updatedEventData.getDescription());
            event.setEventDateTime(updatedEventData.getEventDateTime());
            event.setImageUrl(updatedEventData.getImageUrl());
            event.setLocation(updatedEventData.getLocation());
            event.setCategories(updatedEventData.getCategories());
            event.setPrice(updatedEventData.getPrice());
            event.setTotalTickets(updatedEventData.getTotalTickets());
            event.setTicketsSold(updatedEventData.getTicketsSold() != null ? updatedEventData.getTicketsSold() : 0);
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found with id " + id));
    }
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public List<Event> searchEventsByTitle(String title) {
        return eventRepository.findByTitleContainingIgnoreCase(title);
    }

    public int getTotalTicketsSoldForEvent(Long eventId) {
        return eventRepository.findById(eventId)
                .map(Event::getTicketsSold)
                .orElse(0);
    }

    public long getTotalTicketsSoldAcrossAllEvents() {
        return eventRepository.findAll().stream()
                .mapToLong(event -> event.getTicketsSold() != null ? event.getTicketsSold() : 0)
                .sum();
    }

    public long getTotalTicketsSoldByCreator(Long creatorId) {
        List<Event> events = eventRepository.findByCreatorId(creatorId);
        return events.stream()
                .mapToLong(event -> event.getTicketsSold() != null ? event.getTicketsSold() : 0)
                .sum();
    }

    @Transactional(readOnly = true)
    public double getTotalRevenueByCreator(Long creatorId) {
        List<Event> creatorEvents = eventRepository.findByCreatorId(creatorId);
        double totalRevenue = 0.0;

        for (Event event : creatorEvents) {
            List<Ticket> ticketsForEvent = ticketRepository.findByEventId(event.getId());
            for (Ticket ticket : ticketsForEvent) {
                totalRevenue += (ticket.getPricePaid() != null ? ticket.getPricePaid() : 0.0);
            }
        }
        return totalRevenue;
    }

}
