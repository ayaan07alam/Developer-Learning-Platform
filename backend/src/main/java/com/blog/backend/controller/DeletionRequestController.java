package com.blog.backend.controller;

import com.blog.backend.model.*;
import com.blog.backend.repository.PostDeletionRequestRepository;
import com.blog.backend.repository.PostRepository;
import com.blog.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/deletion-requests")
@CrossOrigin(origins = "*")
public class DeletionRequestController {

    @Autowired
    private PostDeletionRequestRepository deletionRequestRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all pending deletion requests (ADMIN/EDITOR only)
    @GetMapping
    public ResponseEntity<?> getPendingRequests(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        if (user.getRole() != Role.ADMIN && user.getRole() != Role.EDITOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only administrators and editors can view deletion requests"));
        }

        List<PostDeletionRequest> requests = deletionRequestRepository
                .findByStatusOrderByCreatedAtDesc(DeletionRequestStatus.PENDING);

        System.out.println("=== DELETION REQUESTS DEBUG ===");
        System.out.println("Found " + requests.size() + " pending requests");
        for (PostDeletionRequest req : requests) {
            System.out.println("Request ID: " + req.getId() + ", Post: " + req.getPost().getTitle());
        }

        return ResponseEntity.ok(requests);
    }

    // Get current user's deletion requests for feedback
    @GetMapping("/my-requests")
    public ResponseEntity<?> getMyRequests(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        List<PostDeletionRequest> requests = deletionRequestRepository
                .findByRequestedByIdOrderByCreatedAtDesc(user.getId());

        return ResponseEntity.ok(requests);
    }

    // Approve deletion request and delete the post
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveDeletion(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        if (user.getRole() != Role.ADMIN && user.getRole() != Role.EDITOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only administrators and editors can approve deletion requests"));
        }

        Optional<PostDeletionRequest> requestOpt = deletionRequestRepository.findById(id);
        if (requestOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Deletion request not found"));
        }

        PostDeletionRequest request = requestOpt.get();
        if (request.getStatus() != DeletionRequestStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "This request has already been processed"));
        }

        try {
            // Update request status
            request.setStatus(DeletionRequestStatus.APPROVED);
            request.setReviewedAt(LocalDateTime.now());
            request.setReviewedBy(user);
            deletionRequestRepository.save(request);

            // Delete the post
            postRepository.deleteById(request.getPost().getId());

            return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to approve deletion: " + e.getMessage()));
        }
    }

    // Deny deletion request
    @PostMapping("/{id}/deny")
    public ResponseEntity<?> denyDeletion(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        if (user.getRole() != Role.ADMIN && user.getRole() != Role.EDITOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only administrators and editors can deny deletion requests"));
        }

        Optional<PostDeletionRequest> requestOpt = deletionRequestRepository.findById(id);
        if (requestOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Deletion request not found"));
        }

        PostDeletionRequest request = requestOpt.get();
        if (request.getStatus() != DeletionRequestStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "This request has already been processed"));
        }

        try {
            request.setStatus(DeletionRequestStatus.DENIED);
            request.setReviewedAt(LocalDateTime.now());
            request.setReviewedBy(user);
            deletionRequestRepository.save(request);

            return ResponseEntity.ok(Map.of("message", "Deletion request denied"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to deny deletion: " + e.getMessage()));
        }
    }
}
