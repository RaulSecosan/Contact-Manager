
package com.contactmanager.backend.controller;

import com.contactmanager.backend.dto.RegisterRequest;
import com.contactmanager.backend.model.User;
import com.contactmanager.backend.repository.UserRepository;
import com.contactmanager.backend.service.UserEventPublisher;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.core.Authentication;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final UserEventPublisher eventPublisher;

    public AuthController(
        UserRepository repository,
        PasswordEncoder passwordEncoder,
        UserEventPublisher eventPublisher

    ) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.eventPublisher = eventPublisher;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> register(@RequestBody RegisterRequest request) {

        if (request.username() == null || request.username().isBlank()
                || request.email() == null || request.email().isBlank()
                || request.password() == null || request.password().length() < 8) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Invalid registration data"
            );
        }

        String username = request.username().trim();
        String email = request.email().trim().toLowerCase();

        if (username.length() > 50 || email.length() > 255) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Username or email is too long"
            );
        }

        if (repository.existsByUsername(username) ||
                repository.existsByEmail(email)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Username or email already exists"
            );
        }

        String passwordHash = passwordEncoder.encode(request.password());

        User user = new User(username, email, passwordHash);
        repository.save(user);
        eventPublisher.userRegistered(user);

        return Map.of("message", "Account created successfully");
    }


    @GetMapping("/me")
    public Map<String, String> currentUser(Authentication authentication) {
        Map<String, String> user = new HashMap<>();
        user.put("email", authentication.getName());
        return user;
    }

}
