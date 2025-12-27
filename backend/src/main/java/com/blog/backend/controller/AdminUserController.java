package com.blog.backend.controller;

import com.blog.backend.dto.UpdateUserProfileRequest;
import com.blog.backend.dto.UserDTO;
import com.blog.backend.model.Role;
import com.blog.backend.model.User;
import com.blog.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @Autowired
    private UserRepository userRepository;

    // Get all users
    @GetMapping
    public ResponseEntity<?> getAllUsers(Authentication authentication) {
        // Check if admin
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole() != Role.ADMIN) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Admin access required");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        List<UserDTO> users = userRepository.findAll().stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getEmail(),
                        user.getDisplayName(),
                        user.getRole().name(),
                        user.getOauthProvider(),
                        user.getCreatedAt(),
                        user.getBio(),
                        user.getProfilePhoto()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    // Get specific user
    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id, Authentication authentication) {
        // Check if admin
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole() != Role.ADMIN) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Admin access required");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

    // Update user profile (admin can edit anyone)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserProfileRequest request,
            Authentication authentication) {

        // Check if admin
        User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getRole() != Role.ADMIN) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Admin access required");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update fields if provided
        if (request.getDisplayName() != null && !request.getDisplayName().isEmpty()) {
            if (userRepository.existsByDisplayName(request.getDisplayName()) &&
                    !user.getDisplayName().equals(request.getDisplayName())) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Display name already taken");
                return ResponseEntity.badRequest().body(error);
            }
            user.setDisplayName(request.getDisplayName());
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
                updatedUser.getDisplayName(),
                updatedUser.getRole().name(),
                updatedUser.getOauthProvider(),
                updatedUser.getCreatedAt(),
                updatedUser.getBio(),
                updatedUser.getProfilePhoto());

        return ResponseEntity.ok(userDTO);
    }
}
