package com.ticket.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final String fromEmail = "your-email";

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSubscriptionConfirmation(String toEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Welcome to Our Newsletter! - Ticket Reservation App");
        message.setText("Dear Subscriber,\n\n"
                + "Thank you for subscribing to our newsletter! You'll now receive updates on new events, special offers, and important announcements directly to your inbox.\n\n"
                + "Stay tuned for exciting events!\n\n"
                + "Best regards,\n"
                + "The Ticket Reservation Team");
        try {
            mailSender.send(message);
            System.out.println("Subscription confirmation email sent to: " + toEmail);
        } catch (MailException e) {
            System.err.println("Error sending subscription confirmation email to " + toEmail + ": " + e.getMessage());
        }
    }


    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        try {
            mailSender.send(message);
            System.out.println("Email sent to: " + to + " with subject: " + subject);
        } catch (MailException e) {
            System.err.println("Error sending email to " + to + ": " + e.getMessage());
        }
    }
}