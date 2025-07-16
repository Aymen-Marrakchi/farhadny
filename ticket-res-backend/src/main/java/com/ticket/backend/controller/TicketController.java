package com.ticket.backend.controller;


import com.ticket.backend.dto.EventDTO;
import com.ticket.backend.dto.TicketDTO;
import com.ticket.backend.dto.TicketPurchaseRequest;
import com.ticket.backend.model.Ticket;
import com.ticket.backend.model.Event;
import com.ticket.backend.model.TicketStatus;
import com.ticket.backend.model.User;
import com.ticket.backend.service.TicketService;
import com.ticket.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;
    private final UserService userService;

    public TicketController(TicketService ticketService, UserService userService) {
        this.ticketService = ticketService;
        this.userService = userService;
    }

    @PreAuthorize("hasAuthority('USER')")
    @PostMapping("/purchase")
    public ResponseEntity<List<TicketDTO>> purchaseTicket(@Valid @RequestBody TicketPurchaseRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String useremail = authentication.getName();

        User authenticatedUser = userService.findByEmail(useremail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found."));

        List<Ticket> purchasedTickets = ticketService.purchaseTickets(
                request,
                authenticatedUser.getId(),
                request.getSeatInfo() != null ? request.getSeatInfo().name() : null
        );
        List<TicketDTO> ticketDTOs = purchasedTickets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(ticketDTOs, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAuthority('USER')")
    @GetMapping("/my-tickets")
    public ResponseEntity<List<TicketDTO>> getMyTickets() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        User authenticatedUser = userService.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found."));

        List<TicketDTO> tickets = ticketService.getUserTickets(authenticatedUser.getId()).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/qrcode/{qrCode}")
    public ResponseEntity<TicketDTO> getTicketByQrCode(@PathVariable String qrCode) {
        return ticketService.getTicketByQrCode(qrCode)
                .map(ticket -> new ResponseEntity<>(convertToDto(ticket), HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @PutMapping("/validate/{qrCode}")
    public ResponseEntity<TicketDTO> validateTicket(@PathVariable String qrCode) {
        Ticket validatedTicket = ticketService.validateTicket(qrCode);
        return new ResponseEntity<>(convertToDto(validatedTicket), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<TicketDTO>> getTicketsByEvent(@PathVariable Long eventId) {
        List<TicketDTO> tickets = ticketService.getTicketsByEvent(eventId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(tickets, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPER_ADMIN')")
    @GetMapping("/stats/count-by-status/{status}")
    public ResponseEntity<Long> countTicketsByStatus(@PathVariable TicketStatus status) {
        long count = ticketService.countTicketsByStatus(status);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    private TicketDTO convertToDto(Ticket ticket) {
        TicketDTO dto = new TicketDTO();
        dto.setId(ticket.getId());
        // dto.setEventId(ticket.getEvent() != null ? ticket.getEvent().getId() : null);
        dto.setUserId(ticket.getUser() != null ? ticket.getUser().getId() : null);
        dto.setQrCode(ticket.getQrCode());
        dto.setStatus(ticket.getTicketStatus());
        dto.setPurchaseDateTime(ticket.getPurchaseDateTime());
        dto.setPricePaid(ticket.getPricePaid());
        dto.setSeatInfo(ticket.getSeatInfo());


        if (ticket.getEvent() != null) {
            Event event = ticket.getEvent();
            EventDTO eventDto = new EventDTO();
            eventDto.setId(event.getId());
            eventDto.setTitle(event.getTitle());
            eventDto.setDescription(event.getDescription());
            eventDto.setEventDateTime(event.getEventDateTime());
            eventDto.setLocation(event.getLocation());
            eventDto.setPrice(event.getPrice());
            eventDto.setImageUrl(event.getImageUrl());
            eventDto.setCategories(event.getCategories());
            eventDto.setTotalTickets(event.getTotalTickets());
            eventDto.setTicketsSold(event.getTicketsSold());
            dto.setEvent(eventDto); // Set the nested EventDTO
        }
        return dto;
    }
}
