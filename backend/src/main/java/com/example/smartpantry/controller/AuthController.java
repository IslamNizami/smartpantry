package com.example.smartpantry.controller;

import com.example.smartpantry.model.dto.LoginRequestDTO;
import com.example.smartpantry.model.dto.RegistrationRequestDTO;
import com.example.smartpantry.model.entity.User;
import com.example.smartpantry.model.entity.VerificationToken;
import com.example.smartpantry.repository.UserRepository;
import com.example.smartpantry.repository.VerificationTokenRepository;
import com.example.smartpantry.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final VerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;

    // 1. Register
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegistrationRequestDTO request) {
        String message = authService.registerUser(request);
        return ResponseEntity.ok(message);
    }

    // 2. Verify email
    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam("token") String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token."));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token has expired.");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        return ResponseEntity.ok("Account verified successfully! You can now log in.");
    }

    // 3. Login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO request) {
        String token = authService.login(request);
        return ResponseEntity.ok(token);
    }
}