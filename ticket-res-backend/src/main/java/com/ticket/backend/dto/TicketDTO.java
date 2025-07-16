package com.ticket.backend.dto;


import com.ticket.backend.model.SeatInfo;
import com.ticket.backend.model.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDTO {
    private Long id;
    private Long eventId;
    private Long userId;
    private String qrCode;
    private TicketStatus status;
    private LocalDateTime purchaseDateTime;
    private Double pricePaid;
    private SeatInfo seatInfo;
    private EventDTO event;
}
