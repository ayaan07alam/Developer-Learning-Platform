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

        // Safely cast the principal
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid authentication token"));
        }

        User user = (User) principal;

        UserDTO userDTO = new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
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

        // Safely cast the principal
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid authentication token"));
        }

        User user = (User) principal;

        // Update fields if provided
        if (request.getUsername() != null && !request.getUsername().isEmpty()) {
            // Check if username is already taken by another user
            if (userRepository.existsByUsername(request.getUsername()) &&
                    !user.getUsername().equals(request.getUsername())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Username already taken");
                return ResponseEntity.badRequest().body(error);
            }
            user.setUsername(request.getUsername());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        if (request.getProfilePhoto() != null) {
            user.setProfilePhoto(request.getProfilePhoto());
        }

        User updatedUser = userRepository.save(user);

        UserDTO userDTO = new UserDTO(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getUsername(),
                updatedUser.getRole().name(),
                updatedUser.getOauthProvider(),
                updatedUser.getCreatedAt(),
                updatedUser.getBio(),
                updatedUser.getProfilePhoto());

        return ResponseEntity.ok(userDTO);
    }
}
