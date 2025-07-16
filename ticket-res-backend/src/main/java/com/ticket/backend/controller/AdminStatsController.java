package com.ticket.backend.controller;

import com.ticket.backend.dto.AdminStatsDTO;
import com.ticket.backend.model.User;
import com.ticket.backend.model.UserRole;
import com.ticket.backend.service.AdminStatsBackendService;
import com.ticket.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin-stats")
@CrossOrigin(origins = "http://localhost:4200")
public class AdminStatsController {

    private final UserService userService;
    @Autowired
    private AdminStatsBackendService adminStatsBackendService;

    public AdminStatsController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    @GetMapping
    public ResponseEntity<List<AdminStatsDTO>> getAllAdminStatistics() {
        List<AdminStatsDTO> stats = adminStatsBackendService.getAllAdminStatistics();
        return ResponseEntity.ok(stats);
    }



    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    @PutMapping("/{userId}/percentage")
    public ResponseEntity<AdminStatsDTO> updateAdminPercentage(
            @PathVariable Long userId,
            @RequestParam Double newPercentage) {
        AdminStatsDTO updatedStats = adminStatsBackendService.updateAdminPercentage(userId, newPercentage);
        return ResponseEntity.ok(updatedStats);
    }
}