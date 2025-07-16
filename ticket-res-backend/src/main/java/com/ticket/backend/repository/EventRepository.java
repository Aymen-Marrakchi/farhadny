package com.ticket.backend.repository;

import com.ticket.backend.model.Event;
import com.ticket.backend.model.EventCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByCategoriesIn(List<EventCategory> categories);
    List<Event> findByEventDateTimeAfterOrderByEventDateTimeAsc(LocalDateTime dateTime);
    List<Event> findByEventDateTimeBeforeOrderByEventDateTimeDesc(LocalDateTime dateTime);
    List<Event>findByTitleContainingIgnoreCase(String title);
    List<Event> findByCreatorId(Long creatorId);
}
