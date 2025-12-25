package com.blog.backend.controller;

import com.blog.backend.dto.UserDTO;
import com.blog.backend.model.Role;
import com.blog.backend.model.User;
import com.blog.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Get all users (ADMIN only)
    @GetMapping
    public ResponseEntity<?> getAllUsers(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        // Safely cast the principal
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error",
                            "Invalid authentication token. Principal type: " + principal.getClass().getName()));
        }

        User currentUser = (User) principal;
        if (currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only admins can view all users"));
        }

        // Convert users to DTOs (excluding sensitive information)
        List<UserDTO> userDTOs = userRepository.findAll().stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getEmail(),
                        user.getUsername(),
                        user.getRole().name(),
                        user.getOauthProvider(),
                        user.getCreatedAt(),
                        user.getBio(),
                        user.getProfilePhoto()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(userDTOs);
    }

    // Update user role (ADMIN only)
    @PatchMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
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

        User currentUser = (User) principal;
        if (currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only admins can update user roles"));
        }

        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        String roleStr = request.get("role");

        try {
            Role newRole = Role.valueOf(roleStr);
            user.setRole(newRole);
            userRepository.save(user);

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
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid role: " + roleStr));
        }
    }

    // Delete user (ADMIN only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
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

        User currentUser = (User) principal;
        if (currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only admins can delete users"));
        }

        // Prevent deleting yourself
        if (currentUser.getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Cannot delete your own account"));
        }

        if (!userRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
