package com.ticket.backend.service;

import com.ticket.backend.model.Event;
import com.ticket.backend.model.User;
import com.ticket.backend.model.UserRole;
import com.ticket.backend.repository.EventRepository;
import com.ticket.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EventRepository eventRepository;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, EventRepository eventRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.eventRepository = eventRepository;
    }

    public User registerUser(User user){
        if( userRepository.existsByEmail(user.getEmail())){
            throw new IllegalArgumentException("Email already registered.");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(UserRole.USER);
        return userRepository.save(user);
    }

    public User authenticate(String email, String password) {

       Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            boolean match = passwordEncoder.matches(password, user.getPassword());
            if (match) {
                return user;
            }
        } else {
            System.out.println("User not found");
        }
        return null;
    }

    public User createAdmin(User adminUser) {
        if (userRepository.existsByEmail(adminUser.getEmail())) {
            throw new IllegalArgumentException("Email already registered for an admin.");
        }
        adminUser.setPassword(passwordEncoder.encode(adminUser.getPassword()));
        if (adminUser.getRole() == null || (adminUser.getRole() != UserRole.ADMIN && adminUser.getRole() == UserRole.USER)) {
            throw new IllegalArgumentException("Admin user must have  SUPER_ADMIN role.");
        }
        return userRepository.save(adminUser);
    }

    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }


    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setEmail(updatedUser.getEmail());
            user.setPhoneNumber(updatedUser.getPhoneNumber());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }


    public User updateUserRole(Long id, UserRole newRole) {
        return userRepository.findById(id).map(user -> {
            user.setRole(newRole);
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    public List<User> findUsersByRole(UserRole role) {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == role)
                .collect(java.util.stream.Collectors.toList());
    }
    public Integer getTotalTicketsSoldByAdmin(Long creatorId) {
        List<Event> events = eventRepository.findByCreatorId(creatorId);
        return events.stream()
                .mapToInt(Event::getTicketsSold)
                .sum();
    }
    @Transactional
    public User updateAdminPercentage(Long userId, Double newPercentage) {
        return userRepository.findById(userId).map(user -> {
            if (user.getRole() != UserRole.ADMIN && user.getRole() != UserRole.SUPER_ADMIN) {
                throw new IllegalArgumentException("Only ADMIN or SUPER_ADMIN users can have a percentage.");
            }
            user.setPercentage(newPercentage);
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User (Admin) not found with id " + userId));
    }

}
