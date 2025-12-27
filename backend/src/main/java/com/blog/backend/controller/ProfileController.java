package com.blog.backend.controller;

import com.blog.backend.dto.UpdateUserProfileRequest;
import com.blog.backend.dto.UserDTO;
import com.blog.backend.model.User;
import com.blog.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    // Get own profile
    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        // Get user email from authentication
        String userEmail = authentication.getName();

        // Fetch fresh user from database
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getRole().name(),
                user.getOauthProvider(),
                user.getCreatedAt(),
                user.getBio(),
                user.getProfilePhoto());

        return ResponseEntity.ok(userDTO);
    }

    // Update own profile
    @PutMapping
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateUserProfileRequest request,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        // Get user email from authentication
        String userEmail = authentication.getName();

        // Fetch fresh user from database
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();

        System.out.println("=== PROFILE UPDATE DEBUG ===");
        System.out.println("Current displayName in DB: " + user.getDisplayName());
        System.out.println("Requested displayName: " + request.getDisplayName());
        System.out.println("Requested bio: " + request.getBio());

        // Update fields if provided
        if (request.getDisplayName() != null && !request.getDisplayName().isEmpty()) {
            // Check if displayName is already taken by another user
            if (userRepository.existsByDisplayName(request.getDisplayName()) &&
                    !user.getDisplayName().equals(request.getDisplayName())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Display name already taken");
                System.out.println("ERROR: Display name already taken");
                return ResponseEntity.badRequest().body(error);
            }
            System.out.println("Setting new displayName: " + request.getDisplayName());
            user.setDisplayName(request.getDisplayName());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        if (request.getProfilePhoto() != null) {
            user.setProfilePhoto(request.getProfilePhoto());
        }

        User updatedUser = userRepository.save(user);
        System.out.println("Saved displayName: " + updatedUser.getDisplayName());
        System.out.println("===========================");

        UserDTO userDTO = new UserDTO(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getDisplayName(),
                updatedUser.getRole().name(),
                updatedUser.getOauthProvider(),
                updatedUser.getCreatedAt(),
                updatedUser.getBio(),
                updatedUser.getProfilePhoto());

        return ResponseEntity.ok(userDTO);
    }
}
