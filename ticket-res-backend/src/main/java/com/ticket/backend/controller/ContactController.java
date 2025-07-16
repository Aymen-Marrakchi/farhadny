package com.ticket.backend.controller;

import com.ticket.backend.dto.ContactMessageDTO;
import com.ticket.backend.model.ContactMessage;
import com.ticket.backend.service.ContactMessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactMessageService contactMessageService;

    public ContactController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }


    @PostMapping
    public ResponseEntity<ContactMessage> submitContactMessage(@RequestBody ContactMessageDTO messageDto) {
        ContactMessage contactMessage = new ContactMessage();
        contactMessage.setEmail(messageDto.getEmail());
        contactMessage.setMessage(messageDto.getMessage());
        contactMessage.setPhoneNumber(messageDto.getPhoneNumber());
        ContactMessage savedMessage = contactMessageService.submitMessage(contactMessage);
        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<List<ContactMessage>> getAllContactMessages() {
        List<ContactMessage> messages = contactMessageService.getAllMessages();
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactMessage> getContactMessageById(@PathVariable Long id) {
        Optional<ContactMessage> message = contactMessageService.getMessageById(id);
        return message.map(contactMessage -> new ResponseEntity<>(contactMessage, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}/mark-replied")
    public ResponseEntity<ContactMessage> markContactMessageAsReplied(@PathVariable Long id) {
        try {
            ContactMessage updatedMessage = contactMessageService.markAsReplied(id);
            return new ResponseEntity<>(updatedMessage, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContactMessage(@PathVariable Long id) {
        try {
            contactMessageService.deleteMessage(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}