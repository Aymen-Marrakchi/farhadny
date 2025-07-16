package com.ticket.backend.service;


import com.ticket.backend.dto.TicketPurchaseRequest;
import com.ticket.backend.model.Event;
import com.ticket.backend.model.Ticket;
import com.ticket.backend.model.TicketStatus;
import com.ticket.backend.model.User;
import com.ticket.backend.repository.EventRepository;
import com.ticket.backend.repository.TicketRepository;
import com.ticket.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;


    public TicketService(TicketRepository ticketRepository, EventRepository eventRepository, UserRepository userRepository, EmailService emailService) {
        this.ticketRepository = ticketRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional
    public List<Ticket> purchaseTickets(TicketPurchaseRequest request, Long userId, String seatInfo) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found."));

        if (event.getTicketsSold() + request.getQuantity() > event.getTotalTickets()) {
            throw new IllegalStateException("Not enough tickets available. Remaining: " + (event.getTotalTickets() - event.getTicketsSold()));
        }
        //Payment processing

        List<Ticket> purchasedTickets = new ArrayList<>();
        for (int i = 0; i < request.getQuantity(); i++) {
            String qrCode = UUID.randomUUID().toString();
            Ticket ticket = new Ticket();
            ticket.setEvent(event);
            ticket.setUser(user);
            ticket.setQrCode(qrCode);
            ticket.setPurchaseDateTime(LocalDateTime.now());
            ticket.setPricePaid(event.getPrice());
            ticket.setTicketStatus(TicketStatus.VALID);
            ticket.setSeatInfo(request.getSeatInfo());

            purchasedTickets.add(ticketRepository.save(ticket));
        }

        for (Ticket ticket : purchasedTickets) {
            String subject = "Your Ticket Confirmation for " + event.getTitle();
            String body = String.format(
                    "Dear %s,\n\n" +
                            "Thank you for your purchase! Here are your ticket details:\n\n" +
                            "Event: %s\n" +
                            "Date & Time: %s\n" +
                            "Location: %s\n" +
                            "Ticket ID: %d\n" +
                            "QR Code: %s\n" +
                            "Price Paid: %.2f TND\n" +
                            "Status: %s\n" +
                            "%s\n\n" +
                            "Please keep this email for event entry. Your QR code is: %s\n\n" +
                            "See you there!\n" +
                            "Your Ticket Team",
                    user.getUsername(),
                    event.getTitle(),
                    event.getEventDateTime(),
                    event.getLocation(),
                    ticket.getId(),
                    ticket.getQrCode(),
                    ticket.getPricePaid(),
                    ticket.getTicketStatus(),
                    ticket.getSeatInfo() != null ? "Seat: " + ticket.getSeatInfo().name() : "",
                    ticket.getQrCode()
            );
            emailService.sendEmail(user.getEmail(), subject, body);
        }

        event.setTicketsSold(event.getTicketsSold() + request.getQuantity());
        eventRepository.save(event);

        return purchasedTickets;

    }

    public List<Ticket> getUserTickets(Long userId) {
        return ticketRepository.findByUserId(userId);
    }
    public Optional<Ticket> getTicketByQrCode(String qrCode) {
        return ticketRepository.findByQrCode(qrCode);
    }

    @Transactional
    public Ticket validateTicket(String qrCode) {
        Ticket ticket = ticketRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new RuntimeException("Ticket not found or invalid QR code."));
        if (ticket.getTicketStatus() == TicketStatus.USED) {
            throw new IllegalStateException("Ticket has already been used.");
        }
        if (ticket.getTicketStatus() == TicketStatus.CANCELLED) {
            throw new IllegalStateException("Ticket has been cancelled.");
        }
        if (ticket.getEvent().getEventDateTime().isAfter(LocalDateTime.now().plusHours(1))) {
            throw new IllegalStateException("Event has not started yet or too early to validate.");
        }
        ticket.setTicketStatus(TicketStatus.USED);
        return ticketRepository.save(ticket);
    }
    public List<Ticket> getTicketsByEvent(Long eventId) {
        return ticketRepository.findByEventId(eventId);
    }

    public long countTicketsByStatus(TicketStatus status) {
        return ticketRepository.findAll().stream()
                .filter(ticket -> ticket.getTicketStatus() == status)
                .count();
    }
}
