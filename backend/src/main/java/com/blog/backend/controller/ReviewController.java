package com.blog.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.blog.backend.dto.PostHistoryResponse;
import com.blog.backend.dto.ReviewRequest;
import com.blog.backend.model.*;
import com.blog.backend.repository.PostHistoryRepository;
import com.blog.backend.repository.PostRepository;
import com.blog.backend.repository.UserRepository;
import com.blog.backend.service.PermissionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostHistoryRepository postHistoryRepository;

    @Autowired
    private PermissionService permissionService;

    @Autowired
    private com.blog.backend.repository.InternalCommentRepository internalCommentRepository;

    /**
     * Add internal comment to a post
     * Accessible by: ADMIN, EDITOR, REVIEWER
     */
    @PostMapping("/{id}/chat")
    public ResponseEntity<?> addInternalComment(@PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<Post> postOpt = postRepository.findById(id);

            if (userOpt.isEmpty() || postOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User or post not found"));
            }

            User user = userOpt.get();
            Post post = postOpt.get();

            if (!permissionService.canEditPost(user, post)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to comment on this post"));
            }

            String content = request.get("content");
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Comment content cannot be empty"));
            }

            PostInternalComment comment = new PostInternalComment();
            comment.setPost(post);
            comment.setUser(user);
            comment.setContent(content);
            internalCommentRepository.save(comment);

            return ResponseEntity.ok(Map.of("message", "Internal comment added successfully", "comment", comment));
        } catch (Exception e) {
            log.error("Failed to add review comment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add comment"));
        }
    }

    /**
     * Get internal comments for a post
     * Accessible by: ADMIN, EDITOR, REVIEWER
     */
    @GetMapping("/{id}/chat")
    public ResponseEntity<?> getInternalComments(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();

            if (!permissionService.hasDashboardAccess(user)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to view internal comments"));
            }

            List<PostInternalComment> comments = internalCommentRepository.findByPostIdOrderByCreatedAtDesc(id);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            log.error("Failed to get review comments", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get comments"));
        }
    }

    /**
     * Get all posts pending review
     * 
     * Accessible by: ADMIN, REVIEWER
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingReviews(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();

            if (!permissionService.canReviewPost(user)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to review posts"));
            }

            List<Post> pendingPosts = postRepository.findByStatus(PostStatus.UNDER_REVIEW);

            return ResponseEntity.ok(pendingPosts);
        } catch (Exception e) {
            log.error("Failed to fetch pending reviews", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch pending reviews"));
        }
    }

    /**
     * Approve a post
     * Accessible by: ADMIN, REVIEWER
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approvePost(@PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<Post> postOpt = postRepository.findById(id);

            if (userOpt.isEmpty() || postOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User or post not found"));
            }

            User user = userOpt.get();
            Post post = postOpt.get();

            if (!permissionService.canReviewPost(user)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to review posts"));
            }

            // Update post status
            PostStatus oldStatus = post.getStatus();
            post.setStatus(PostStatus.APPROVED);
            post.setReviewedBy(user);
            post.setReviewedAt(LocalDateTime.now());
            post.setReviewComments(request.getComments());

            Post savedPost = postRepository.save(post);

            // Create history entry
            PostHistory history = new PostHistory();
            history.setPost(post);
            history.setModifiedBy(user);
            history.setAction("APPROVED");
            history.setChangeDescription(request.getComments());
            history.setOldStatus(oldStatus);
            history.setNewStatus(PostStatus.APPROVED);
            history.setPostVersion(post.getVersion());
            postHistoryRepository.save(history);

            return ResponseEntity.ok(Map.of(
                    "message", "Post approved successfully",
                    "post", savedPost));
        } catch (Exception e) {
            log.error("Post approval via review failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to approve post"));
        }
    }

    /**
     * Reject a post
     * Accessible by: ADMIN, REVIEWER
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectPost(@PathVariable Long id,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<Post> postOpt = postRepository.findById(id);

            if (userOpt.isEmpty() || postOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User or post not found"));
            }

            User user = userOpt.get();
            Post post = postOpt.get();

            if (!permissionService.canReviewPost(user)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to review posts"));
            }

            // Update post status
            PostStatus oldStatus = post.getStatus();
            post.setStatus(PostStatus.REJECTED);
            post.setReviewedBy(user);
            post.setReviewedAt(LocalDateTime.now());
            post.setReviewComments(request.getComments());

            Post savedPost = postRepository.save(post);

            // Create history entry
            PostHistory history = new PostHistory();
            history.setPost(post);
            history.setModifiedBy(user);
            history.setAction("REJECTED");
            history.setChangeDescription(request.getComments());
            history.setOldStatus(oldStatus);
            history.setNewStatus(PostStatus.REJECTED);
            history.setPostVersion(post.getVersion());
            postHistoryRepository.save(history);

            return ResponseEntity.ok(Map.of(
                    "message", "Post rejected",
                    "post", savedPost));
        } catch (Exception e) {
            log.error("Post rejection via review failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to reject post"));
        }
    }

    /**
     * Get post history
     * Accessible by: ADMIN, EDITOR, REVIEWER
     */
    @GetMapping("/history/{id}")
    public ResponseEntity<?> getPostHistory(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();

            if (!permissionService.hasDashboardAccess(user)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to view post history"));
            }

            List<PostHistory> history = postHistoryRepository.findByPostIdOrderByCreatedAtDesc(id);
            List<PostHistoryResponse> response = history.stream()
                    .map(PostHistoryResponse::fromPostHistory)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to fetch post history", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch post history"));
        }
    }

    /**
     * Submit post for review
     * Accessible by: ADMIN, EDITOR
     */
    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitForReview(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<Post> postOpt = postRepository.findById(id);

            if (userOpt.isEmpty() || postOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User or post not found"));
            }

            User user = userOpt.get();
            Post post = postOpt.get();

            if (!permissionService.canEditPost(user, post)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You don't have permission to submit this post"));
            }

            // Update post status
            PostStatus oldStatus = post.getStatus();
            post.setStatus(PostStatus.UNDER_REVIEW);
            post.setLastModifiedBy(user);

            Post savedPost = postRepository.save(post);

            // Create history entry
            PostHistory history = new PostHistory();
            history.setPost(post);
            history.setModifiedBy(user);
            history.setAction("SUBMITTED_FOR_REVIEW");
            history.setChangeDescription("Post submitted for review");
            history.setOldStatus(oldStatus);
            history.setNewStatus(PostStatus.UNDER_REVIEW);
            history.setPostVersion(post.getVersion());
            postHistoryRepository.save(history);

            return ResponseEntity.ok(Map.of(
                    "message", "Post submitted for review",
                    "post", savedPost));
        } catch (Exception e) {
            log.error("Post submission for review failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to submit post"));
        }
    }
}
