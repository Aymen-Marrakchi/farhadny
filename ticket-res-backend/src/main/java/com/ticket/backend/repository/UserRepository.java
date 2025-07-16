package com.ticket.backend.repository;

import com.ticket.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    boolean existsByEmail(String email);
    Optional<User> findByUsernameIgnoreCase(String username);
}
