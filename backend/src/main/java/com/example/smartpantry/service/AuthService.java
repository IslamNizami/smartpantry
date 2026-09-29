package com.example.smartpantry.service;

import com.example.smartpantry.model.dto.LoginRequestDTO;
import com.example.smartpantry.model.dto.RegistrationRequestDTO;
import com.example.smartpantry.model.entity.Role;
import com.example.smartpantry.model.entity.User;
import com.example.smartpantry.model.entity.VerificationToken;
import com.example.smartpantry.repository.RoleRepository;
import com.example.smartpantry.repository.UserRepository;
import com.example.smartpantry.repository.VerificationTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final VerificationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public String registerUser(RegistrationRequestDTO request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already in use!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setProvider("LOCAL");
        user.setEnabled(false);

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: role not found."));
        user.setRoles(Set.of(userRole));

        userRepository.save(user);

        // Generate & save verification token
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(user, token);
        tokenRepository.save(verificationToken); // ← persisted

        // Send async email
        emailService.sendVerificationEmail(user.getEmail(), token);

        return "User registered successfully. Please check your email to verify your account.";
    }

    public String login(LoginRequestDTO request) {
        // AuthenticationManager handles password check + enabled check automatically
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found."));

        return jwtService.generateToken(user);
    }
}