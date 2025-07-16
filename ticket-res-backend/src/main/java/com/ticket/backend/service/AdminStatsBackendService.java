package com.ticket.backend.service;

import com.ticket.backend.dto.AdminStatsDTO;
import com.ticket.backend.model.User;
import com.ticket.backend.model.UserRole;
import com.ticket.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminStatsBackendService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;
    @Transactional(readOnly = true)
    public List<AdminStatsDTO> getAllAdminStatistics() {
        List<User> adminUsers = userRepository.findAll().stream()
                .filter(user -> user.getRole() == UserRole.ADMIN )
                .collect(Collectors.toList());

        double grandTotalSystemRevenue = adminUsers.stream()
                .mapToDouble(admin -> eventService.getTotalRevenueByCreator(admin.getId()))
                .sum();

        return adminUsers.stream()
                .map(admin -> {
                    double adminRevenue = eventService.getTotalRevenueByCreator(admin.getId());
                    double calculatedPercentage = (grandTotalSystemRevenue > 0) ? (adminRevenue / grandTotalSystemRevenue) * 100 : 0.0;

                    Double percentageToDisplay = admin.getPercentage() != null ? admin.getPercentage() : calculatedPercentage;

                    return new AdminStatsDTO(
                            admin.getId(),
                            admin.getEmail(),
                            adminRevenue,
                            percentageToDisplay
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminStatsDTO updateAdminPercentage(Long userId, Double newPercentage) {
        User updatedUser = userService.updateAdminPercentage(userId, newPercentage);

        double userRevenue = eventService.getTotalRevenueByCreator(updatedUser.getId());

        return new AdminStatsDTO(
                updatedUser.getId(),
                updatedUser.getEmail(),
                userRevenue,
                updatedUser.getPercentage()
        );
    }
}