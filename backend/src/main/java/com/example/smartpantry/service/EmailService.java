package com.example.smartpantry.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendVerificationEmail(String to, String token) {
        String subject = "Verify your Smart Pantry Account";
        String confirmationUrl = "http://localhost:8080/api/auth/verify?token=" + token;
        String message = "Please click the link below to verify your account:\n" + confirmationUrl;

        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom("noreply@smartpantry.com");
        email.setTo(to);
        email.setSubject(subject);
        email.setText(message);
        mailSender.send(email);
    }
}