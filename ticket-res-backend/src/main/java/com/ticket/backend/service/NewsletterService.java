package com.ticket.backend.service;


import com.ticket.backend.model.NewsletterSubscription;
import com.ticket.backend.repository.NewsletterSubscriptionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class NewsletterService {
    private final NewsletterSubscriptionRepository newsletterSubscriptionRepository;
    private final EmailService emailService;

    public NewsletterService(NewsletterSubscriptionRepository newsletterSubscriptionRepository, EmailService emailService) {
        this.newsletterSubscriptionRepository = newsletterSubscriptionRepository;
        this.emailService = emailService;
    }

    public NewsletterSubscription subscribe(String email) {
        NewsletterSubscription subscription;
        if (newsletterSubscriptionRepository.existsByEmail(email)) {
            Optional<NewsletterSubscription> existingSubscription = newsletterSubscriptionRepository.findByEmail(email);
            if (existingSubscription.isPresent() && existingSubscription.get().isActive()) {
                throw new IllegalArgumentException("Email is already subscribed and active.");
            } else if (existingSubscription.isPresent() && !existingSubscription.get().isActive()) {
                subscription = existingSubscription.get();
                subscription.setActive(true);
                subscription.setSubscriptionDate(LocalDateTime.now());
                subscription = newsletterSubscriptionRepository.save(subscription);
            } else {
                subscription = new NewsletterSubscription();
                subscription.setEmail(email);
                subscription.setSubscriptionDate(LocalDateTime.now());
                subscription.setActive(true);
                subscription = newsletterSubscriptionRepository.save(subscription);
            }
        } else {
            subscription = new NewsletterSubscription();
            subscription.setEmail(email);
            subscription.setSubscriptionDate(LocalDateTime.now());
            subscription.setActive(true);
            subscription = newsletterSubscriptionRepository.save(subscription);
        }

        emailService.sendSubscriptionConfirmation(email);

        return subscription;
    }

    public void unsubscribe(String email) {
        NewsletterSubscription subscription = newsletterSubscriptionRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found in subscriptions."));
        newsletterSubscriptionRepository.delete(subscription);
    }
}
