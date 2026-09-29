package com.example.smartpantry.service;

import com.example.smartpantry.model.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    private final String secretKey = "4a6176614d61737465725265636970655365637265744b657932303236424d4553747564656e74";
    private final long jwtExpiration = 86400000; // 24 hours

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRoles().iterator().next().getName());

        return Jwts.builder()
                .claims(claims)                                                    // 0.12.x
                .subject(user.getEmail())                                          // 0.12.x
                .issuedAt(new Date(System.currentTimeMillis()))                    // 0.12.x
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))  // 0.12.x
                .signWith(getSignInKey())                                           // 0.12.x — no algorithm arg
                .compact();
    }

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, User user) {
        final String email      = extractEmail(token);
        final Date   expiration = parseClaims(token).getExpiration();
        return email.equals(user.getEmail()) && expiration.after(new Date());
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}