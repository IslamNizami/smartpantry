package com.example.smartpantry.config;

import com.example.smartpantry.model.entity.Role;
import com.example.smartpantry.model.entity.User;
import com.example.smartpantry.repository.RoleRepository;
import com.example.smartpantry.repository.UserRepository;
import com.example.smartpantry.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        // 1. Get Google user info
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // 2. Shadow Registration Logic
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setProvider("GOOGLE");
            newUser.setEnabled(true); // Google users are already verified

            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Default Role not found"));
            newUser.setRoles(Set.of(userRole));

            return userRepository.save(newUser);
        });

        // 3. Create  app's JWT
        String token = jwtService.generateToken(user);

        // 4. Redirect to React with the token
        String targetUrl = "http://localhost:5173/login-success?token=" + token;

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}