package com.blog.backend.controller;

import com.blog.backend.model.JobRole;
import com.blog.backend.model.User;
import com.blog.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class JobRoleController {

    @Autowired
    private UserRepository userRepository;

    // Get current user's job role
    @GetMapping("/job-role")
    public ResponseEntity<?> getJobRole() {
        try {
            // Get authentication from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            System.out.println("=== GET JOB ROLE DEBUG ===");
            System.out.println("Authentication: " + authentication);
            System.out.println("Is authenticated: " + (authentication != null && authentication.isAuthenticated()));

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authentication required"));
            }

            String email = authentication.getName();
            System.out.println("Email from auth: " + email);

            if (email == null || email.equals("anonymousUser")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User not authenticated"));
            }

            Optional<User> userOpt = userRepository.findByEmail(email);
            System.out.println("User found: " + userOpt.isPresent());

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            JobRole jobRole = user.getJobRole();
            System.out.println("Job role: " + jobRole);

            Map<String, Object> response = new HashMap<>();
            if (jobRole == null) {
                response.put("jobRole", null);
                response.put("hasSelected", false);
            } else {
                response.put("jobRole", jobRole.name());
                response.put("hasSelected", true);
            }

            System.out.println("Returning response: " + response);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("ERROR in getJobRole:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error",
                            "Failed to get job role: " + e.getClass().getSimpleName() + " - " + e.getMessage()));
        }
    }

    // Select job role (first time)
    @PostMapping("/select-job-role")
    public ResponseEntity<?> selectJobRole(@RequestBody Map<String, String> request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authentication required"));
            }

            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            String roleStr = request.get("jobRole");

            if (roleStr == null || roleStr.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Job role is required"));
            }

            JobRole jobRole;
            try {
                jobRole = JobRole.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid job role. Must be JOB_SEEKER or EMPLOYER"));
            }

            user.setJobRole(jobRole);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "Job role selected successfully",
                    "jobRole", jobRole.name()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to select job role"));
        }
    }

    // Change job role
    @PutMapping("/change-job-role")
    public ResponseEntity<?> changeJobRole(@RequestBody Map<String, String> request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authentication required"));
            }

            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();
            String roleStr = request.get("jobRole");

            if (roleStr == null || roleStr.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Job role is required"));
            }

            JobRole jobRole;
            try {
                jobRole = JobRole.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid job role. Must be JOB_SEEKER or EMPLOYER"));
            }

            user.setJobRole(jobRole);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "Job role changed successfully",
                    "jobRole", jobRole.name()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to change job role"));
        }
    }
}
