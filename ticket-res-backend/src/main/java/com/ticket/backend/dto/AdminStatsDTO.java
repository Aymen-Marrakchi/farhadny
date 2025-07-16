package com.ticket.backend.dto;

import com.ticket.backend.model.UserRole;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDTO {
    private Long id;
    private String email;
    private UserRole role;
    //private Integer totalTicketsSold;
    private double totalRevenue;
    private Double percentage;

    public AdminStatsDTO(Long id, String email, double totalRevenue, double percentage) {
        this.id = id;
        this.email = email;
        this.totalRevenue = totalRevenue;
        this.percentage = percentage;
    }
}
