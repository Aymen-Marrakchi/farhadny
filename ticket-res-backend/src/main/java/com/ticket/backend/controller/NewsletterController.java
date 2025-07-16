package com.ticket.backend.controller;


import com.ticket.backend.dto.NewsletterSubscriptionDTO;
import com.ticket.backend.service.NewsletterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {
    private final NewsletterService newsletterService;

    public NewsletterController(NewsletterService newsletterService) {
        this.newsletterService = newsletterService;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<NewsletterSubscriptionDTO> subscribe(@Valid @RequestBody NewsletterSubscriptionDTO subscriptionDTO) {
        NewsletterSubscriptionDTO subscribed = convertToDto(newsletterService.subscribe(subscriptionDTO.getEmail()));
        return new ResponseEntity<>(subscribed, HttpStatus.CREATED);
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<Void> unsubscribe(@RequestBody NewsletterSubscriptionDTO subscriptionDTO) {
        newsletterService.unsubscribe(subscriptionDTO.getEmail());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    private NewsletterSubscriptionDTO convertToDto(com.ticket.backend.model.NewsletterSubscription subscription) {
        NewsletterSubscriptionDTO dto = new NewsletterSubscriptionDTO();
        dto.setId(subscription.getId());
        dto.setEmail(subscription.getEmail());
        dto.setSubscriptionDate(subscription.getSubscriptionDate());
        dto.setActive(subscription.isActive());
        return dto;
    }

}
