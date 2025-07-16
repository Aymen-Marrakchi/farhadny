package com.ticket.backend.service;


import com.ticket.backend.model.ContactMessage;
import com.ticket.backend.repository.ContactMessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ContactMessageService {
    private final ContactMessageRepository contactMessageRepository;

    public ContactMessageService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    public ContactMessage submitMessage(ContactMessage message) {
        message.setSentTime(LocalDateTime.now());
        message.setReplied(false);
        return contactMessageRepository.save(message);
    }
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAll();
    }

    public Optional<ContactMessage> getMessageById(Long id) {
        return contactMessageRepository.findById(id);
    }

    public ContactMessage markAsReplied(Long id) {
        return contactMessageRepository.findById(id).map(message -> {
            message.setReplied(true);
            return contactMessageRepository.save(message);
        }).orElseThrow(() -> new RuntimeException("Contact message not found with id " + id));
    }
    @Transactional // Add @Transactional for delete operations
    public void deleteMessage(Long id) {
        if (!contactMessageRepository.existsById(id)) {
            throw new RuntimeException("Contact message not found with id " + id);
        }
        contactMessageRepository.deleteById(id);
    }
}
