package com.ticket.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, length=2000)
    private String message;

    @Column(nullable = false)
    private String email;


    private String phoneNumber;

    private Boolean Replied ;

    private LocalDateTime sentTime;
}
