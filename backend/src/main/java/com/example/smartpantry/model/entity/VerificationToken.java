package com.example.smartpantry.model.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String token;

    @OneToOne
    private User user;

    private LocalDateTime expiryDate;

    public VerificationToken(User user, String token){
        this.user = user;
        this.token = token;
        this.expiryDate = LocalDateTime.now().plusHours(24);
    }
}
