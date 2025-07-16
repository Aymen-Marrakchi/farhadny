package com.ticket.backend.dto;

import com.ticket.backend.model.UserRole; // Import your UserRole enum
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List; // For list of roles

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String jwt;
    private String message;
    private Long id;
    private String username;
    private String email;
    private UserRole role;
}