package com.ticket.backend.repository;

import com.ticket.backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket>findByUserId(Long userId);
    List<Ticket>findByEventId(Long eventId);
    Optional<Ticket> findByQrCode(String qrCode);
}
