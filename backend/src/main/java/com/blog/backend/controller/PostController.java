package com.blog.backend.controller;

import com.blog.backend.dto.CreatePostRequest;
import com.blog.backend.dto.UpdatePostRequest;
import com.blog.backend.model.*;
import com.blog.backend.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostViewRepository postViewRepository;

    @Autowired
    private com.blog.backend.service.PermissionService permissionService;

    @Autowired
    private com.blog.backend.service.PostHistoryService postHistoryService;

    @Autowired
    private com.blog.backend.repository.PostHistoryRepository postHistoryRepository;

    @Autowired
    private PostDeletionRequestRepository deletionRequestRepository;

    // Get all posts (with optional filters)
    @GetMapping
    public ResponseEntity<?> getAllPosts(
            @RequestParam(required = false) PostStatus status,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long authorId) {

        List<Post> posts = postRepository.findAll();

        // Apply filters
        if (status != null) {
            posts = posts.stream()
                    .filter(p -> p.getStatus() == status)
                    .collect(Collectors.toList());
        } else {
            // Default behavior: show only PUBLISHED posts if no status filter provided
            // unless user is ADMIN/EDITOR/REVIEWER (handled in frontend logic usually,
            // but strict API should filter)
            // For now, let's return all and let frontend filter, or restrict based on auth
            // later
        }

        if (categoryId != null) {
            posts = posts.stream()
                    .filter(p -> p.getCategories().stream().anyMatch(c -> c.getId().equals(categoryId)))
                    .collect(Collectors.toList());
        }

        if (authorId != null) {
            posts = posts.stream()
                    .filter(p -> p.getAuthor() != null && p.getAuthor().getId().equals(authorId))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(posts);
    }

    // Search posts by query (title, content, category) - MUST BE BEFORE /{id}
    @GetMapping("/search")
    public ResponseEntity<?> searchPosts(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        String query = q.toLowerCase().trim();

        List<Post> allPosts = postRepository.findAll();
        List<Post> searchResults = allPosts.stream()
                .filter(post -> post.getStatus() == PostStatus.PUBLISHED) // Only published posts
                .filter(post -> {
                    // Search in title
                    boolean titleMatch = post.getTitle() != null &&
                            post.getTitle().toLowerCase().contains(query);

                    // Search in content
                    boolean contentMatch = post.getContent() != null &&
                            post.getContent().toLowerCase().contains(query);

                    // Search in excerpt
                    boolean excerptMatch = post.getExcerpt() != null &&
                            post.getExcerpt().toLowerCase().contains(query);

                    // Search in categories
                    boolean categoryMatch = post.getCategories() != null &&
                            post.getCategories().stream()
                                    .anyMatch(cat -> cat.getName() != null &&
                                            cat.getName().toLowerCase().contains(query));

                    return titleMatch || contentMatch || excerptMatch || categoryMatch;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(searchResults);
    }

    // Get single post by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        Optional<Post> post = postRepository.findById(id);
        if (post.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found"));
        }
        return ResponseEntity.ok(post.get());
    }

    // Get single post by slug
    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getPostBySlug(@PathVariable String slug,
            @RequestHeader(value = "X-Forwarded-For", required = false) String xForwardedFor,
            @RequestHeader(value = "User-Agent", required = false) String userAgent) {
        Optional<Post> postOpt = postRepository.findBySlug(slug);
        if (postOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found"));
        }

        Post post = postOpt.get();

        // Track view (only once per IP per day)
        String ipAddress = xForwardedFor != null ? xForwardedFor.split(",")[0] : "unknown";
        LocalDateTime oneDayAgo = LocalDateTime.now().minusDays(1);

        if (!postViewRepository.existsByPostIdAndIpAddressAndViewDateAfter(post.getId(), ipAddress, oneDayAgo)) {
            PostView view = new PostView(post, ipAddress, userAgent);
            postViewRepository.save(view);

            // Update view count
            post.setViewCount(post.getViewCount() + 1);
            postRepository.save(post);
        }

        return ResponseEntity.ok(post);
    }

    // Create new post (ADMIN, EDITOR)
    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody CreatePostRequest request,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        // Actually this might be UserDetails, let's fix
        Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();

        if (!permissionService.canCreatePost(user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to create posts"));
        }

        Post post = new Post();
        post.setTitle(request.getTitle());

        // Auto-generate slug if not provided
        String baseSlug;
        if (request.getSlug() == null || request.getSlug().isEmpty()) {
            baseSlug = generateSlug(request.getTitle());
        } else {
            baseSlug = request.getSlug();
        }

        // Ensure slug is unique by appending number if needed
        String uniqueSlug = baseSlug;
        int counter = 1;
        while (postRepository.findBySlug(uniqueSlug).isPresent()) {
            uniqueSlug = baseSlug + "-" + counter;
            counter++;
        }
        post.setSlug(uniqueSlug);

        // Set status - Editors can only create DRAFT
        post.setStatus(request.getStatus() != null ? request.getStatus() : PostStatus.DRAFT);

        // If user is not ADMIN, force DRAFT initially?
        // Let's allow EDITOR to set status but usually they start with DRAFT

        post.setMainImage(request.getMainImage());
        post.setFeaturedImage(request.getFeaturedImage());
        post.setExcerpt(request.getExcerpt());
        post.setContent(request.getContent());
        post.setMetaTitle(request.getMetaTitle());
        post.setMetaDescription(request.getMetaDescription());
        post.setTags(request.getTags());
        post.setTocItems(request.getTocItems());
        post.setShowToc(request.getShowToc());
        post.setCreatedBy(user);
        post.setLastModifiedBy(user);

        // Calculate read time (rough estimate: 200 words per minute)
        if (request.getContent() != null) {
            int wordCount = request.getContent().split("\\s+").length;
            post.setReadTime((int) Math.ceil(wordCount / 200.0));
        }

        // Set author
        if (request.getAuthorId() != null) {
            authorRepository.findById(request.getAuthorId())
                    .ifPresent(post::setAuthor);
        }

        // Set categories
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>();
            for (Long catId : request.getCategoryIds()) {
                categoryRepository.findById(catId).ifPresent(categories::add);
            }
            post.setCategories(categories);
        }

        // Set published date if status is PUBLISHED
        if (post.getStatus() == PostStatus.PUBLISHED && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }

        try {
            Post savedPost = postRepository.save(post);

            // Track creation in history
            postHistoryService.trackCreation(savedPost, user);

            // Create FAQs if provided
            if (request.getFaqs() != null && !request.getFaqs().isEmpty()) {
                for (com.blog.backend.dto.FAQDTO faqDTO : request.getFaqs()) {
                    FAQ faq = new FAQ();
                    faq.setPost(savedPost);
                    faq.setQuestion(faqDTO.getQuestion());
                    faq.setAnswer(faqDTO.getAnswer());
                    faq.setDisplayOrder(faqDTO.getDisplayOrder());
                    savedPost.getFaqs().add(faq);
                }
                savedPost = postRepository.save(savedPost);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create post: " + e.getMessage()));
        }
    }

    // Update post (ADMIN, EDITOR)
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id,
            @RequestBody UpdatePostRequest request,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }
        User user = userOpt.get();

        Optional<Post> postOpt = postRepository.findById(id);

        if (postOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found"));
        }

        Post post = postOpt.get();
        PostStatus oldStatus = post.getStatus();

        // Check permissions
        if (!permissionService.canEditPost(user, post)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to edit this post"));
        }

        // Update fields
        boolean statusChanged = false;
        if (request.getTitle() != null)
            post.setTitle(request.getTitle());
        if (request.getSlug() != null)
            post.setSlug(request.getSlug());
        if (request.getStatus() != null && request.getStatus() != oldStatus) {
            // Set published date when changing from DRAFT to PUBLISHED
            if (oldStatus != PostStatus.PUBLISHED &&
                    request.getStatus() == PostStatus.PUBLISHED &&
                    post.getPublishedAt() == null) {
                post.setPublishedAt(LocalDateTime.now());
            }
            post.setStatus(request.getStatus());
            statusChanged = true;
        }
        if (request.getMainImage() != null)
            post.setMainImage(request.getMainImage());
        if (request.getFeaturedImage() != null)
            post.setFeaturedImage(request.getFeaturedImage());
        if (request.getExcerpt() != null)
            post.setExcerpt(request.getExcerpt());
        if (request.getContent() != null) {
            post.setContent(request.getContent());
            // Recalculate read time
            int wordCount = request.getContent().split("\\s+").length;
            post.setReadTime((int) Math.ceil(wordCount / 200.0));
        }
        if (request.getMetaTitle() != null)
            post.setMetaTitle(request.getMetaTitle());
        if (request.getMetaDescription() != null)
            post.setMetaDescription(request.getMetaDescription());
        if (request.getTags() != null)
            post.setTags(request.getTags());
        if (request.getTocItems() != null)
            post.setTocItems(request.getTocItems());
        if (request.getShowToc() != null)
            post.setShowToc(request.getShowToc());

        post.setLastModifiedBy(user);

        // Update author
        if (request.getAuthorId() != null) {
            authorRepository.findById(request.getAuthorId())
                    .ifPresent(post::setAuthor);
        }

        // Update categories
        if (request.getCategoryIds() != null) {
            Set<Category> categories = new HashSet<>();
            for (Long catId : request.getCategoryIds()) {
                categoryRepository.findById(catId).ifPresent(categories::add);
            }
            post.setCategories(categories);
        }

        // Update FAQs
        if (request.getFaqs() != null) {
            post.getFaqs().clear(); // Clear existing FAQs
            if (!request.getFaqs().isEmpty()) {
                for (com.blog.backend.dto.FAQDTO faqDTO : request.getFaqs()) {
                    FAQ faq = new FAQ();
                    faq.setPost(post);
                    faq.setQuestion(faqDTO.getQuestion());
                    faq.setAnswer(faqDTO.getAnswer());
                    faq.setDisplayOrder(faqDTO.getDisplayOrder());
                    post.getFaqs().add(faq);
                }
            }
        }

        try {
            Post savedPost = postRepository.save(post);

            // Track history
            if (statusChanged) {
                postHistoryService.trackStatusChange(savedPost, user, oldStatus, savedPost.getStatus());
            } else {
                postHistoryService.trackUpdate(savedPost, user, "Post updated");
            }

            return ResponseEntity.ok(savedPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update post: " + e.getMessage()));
        }
    }

    // Delete post (Users can delete their own DRAFT/UNDER_REVIEW posts, Admins can
    // delete any post)
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deletePost(@PathVariable Long id, Authentication authentication) {
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
        User currentUser = userOpt.get();

        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found or already deleted"));
        }
        Post post = postOpt.get();

        // Check permissions
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isEditor = currentUser.getRole() == Role.EDITOR;
        boolean isOwner = post.getCreatedBy().getId().equals(currentUser.getId());
        boolean isUnpublished = post.getStatus() == PostStatus.DRAFT || post.getStatus() == PostStatus.UNDER_REVIEW;

        // Admin and Editor can delete ANY post
        // Regular users can only delete their own UNPUBLISHED posts
        if (!isAdmin && !isEditor) {
            if (!isOwner) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You can only delete your own posts"));
            }
            if (!isUnpublished) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error",
                                "Published posts cannot be deleted directly. Please request deletion instead."));
            }
        }

        try {
            // Clear all relationships before deleting to avoid constraint violations
            post.setCategories(new HashSet<>());
            post.setTags(new ArrayList<>());
            post.getFaqs().clear(); // Clear FAQs
            postRepository.save(post); // Save to update relationships

            // Delete associated views
            postViewRepository.deleteByPostId(id);

            // Delete post history records
            postHistoryRepository.deleteByPostId(id);

            // Now safe to delete the post
            postRepository.deleteById(id);

            return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete post: " + e.getMessage()));
        }
    }

    // Request deletion of a published post
    @PostMapping("/{id}/request-deletion")
    public ResponseEntity<?> requestDeletion(
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User currentUser = userOpt.get();
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found"));
        }

        Post post = postOpt.get();

        // Only allow post owner to request deletion
        if (!post.getCreatedBy().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only request deletion of your own posts"));
        }

        // Check if already has pending request
        Optional<PostDeletionRequest> existingRequest = deletionRequestRepository
                .findByPostIdAndStatus(id, DeletionRequestStatus.PENDING);
        if (existingRequest.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "A deletion request for this post is already pending"));
        }

        try {
            PostDeletionRequest deletionRequest = new PostDeletionRequest();
            deletionRequest.setPost(post);
            deletionRequest.setRequestedBy(currentUser);
            deletionRequest.setReason(requestBody.get("reason"));
            deletionRequest.setStatus(DeletionRequestStatus.PENDING);

            deletionRequestRepository.save(deletionRequest);

            return ResponseEntity.ok(Map.of("message", "Deletion request submitted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to submit deletion request: " + e.getMessage()));
        }
    }

    // Publish post
    @PatchMapping("/{id}/publish")
    public ResponseEntity<?> publishPost(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found"));
        }

        Post post = postOpt.get();
        post.setStatus(PostStatus.PUBLISHED);
        if (post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }

        Post updatedPost = postRepository.save(post);
        return ResponseEntity.ok(updatedPost);
    }

    // Unpublish post
    @PatchMapping("/{id}/unpublish")
    public ResponseEntity<?> unpublishPost(@PathVariable Long id, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        User currentUser = (User) authentication.getPrincipal();
        if (currentUser.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only admins can unpublish posts"));
        }

        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found"));
        }

        Post post = postOpt.get();
        post.setStatus(PostStatus.DRAFT);

        Post updatedPost = postRepository.save(post);
        return ResponseEntity.ok(updatedPost);
    }

    // Helper method to generate slug from title
    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    // ==================== WRITER SUBMISSION ENDPOINTS ====================

    // Get my submissions (WRITER+)
    @GetMapping("/my-submissions")
    public ResponseEntity<?> getMySubmissions(Authentication authentication) {
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
        List<Post> submissions = postRepository.findByCreatedByOrderByCreatedAtDesc(user);

        // Include submission stats
        long draftCount = postRepository.countByCreatedByAndStatus(user, PostStatus.DRAFT);
        long underReviewCount = postRepository.countByCreatedByAndStatus(user, PostStatus.UNDER_REVIEW);
        long publishedCount = postRepository.countByCreatedByAndStatus(user, PostStatus.PUBLISHED);
        long totalCount = submissions.size();

        Map<String, Object> response = new HashMap<>();
        response.put("submissions", submissions);
        response.put("stats", Map.of(
                "total", totalCount,
                "draft", draftCount,
                "pendingApproval", underReviewCount,
                "published", publishedCount));

        return ResponseEntity.ok(response);
    }

    // Submit post for approval (WRITER+)
    @PostMapping("/{id}/submit")
    public ResponseEntity<?> submitForApproval(@PathVariable Long id, Authentication authentication) {
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

        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found"));
        }

        Post post = postOpt.get();

        // Verify ownership
        if (!post.getCreatedBy().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only submit your own posts"));
        }

        // Only DRAFT posts can be submitted
        if (post.getStatus() != PostStatus.DRAFT) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Only draft posts can be submitted for approval"));
        }

        // Update status and timestamp
        post.setStatus(PostStatus.UNDER_REVIEW);
        post.setSubmittedAt(LocalDateTime.now());

        try {
            Post updatedPost = postRepository.save(post);
            postHistoryService.trackStatusChange(updatedPost, user, PostStatus.DRAFT, PostStatus.UNDER_REVIEW);

            return ResponseEntity.ok(Map.of(
                    "message", "Post submitted for approval successfully",
                    "post", updatedPost));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to submit post: " + e.getMessage()));
        }
    }

    // Approve post (EDITOR/ADMIN only)
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approvePost(@PathVariable Long id, Authentication authentication) {
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

        // Check permissions - only EDITOR or ADMIN can approve
        if (user.getRole() != Role.EDITOR && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only editors and admins can approve posts"));
        }

        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found"));
        }

        Post post = postOpt.get();

        // Post must be in UNDER_REVIEW status
        if (post.getStatus() != PostStatus.UNDER_REVIEW) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Only pending posts can be approved"));
        }

        // Approve and publish
        post.setStatus(PostStatus.PUBLISHED);
        post.setApprovedBy(user);
        post.setApprovedAt(LocalDateTime.now());
        if (post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }

        try {
            Post updatedPost = postRepository.save(post);
            postHistoryService.trackStatusChange(updatedPost, user, PostStatus.UNDER_REVIEW, PostStatus.PUBLISHED);

            return ResponseEntity.ok(Map.of(
                    "message", "Post approved and published successfully",
                    "post", updatedPost));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to approve post: " + e.getMessage()));
        }
    }

    // Reject post (EDITOR/ADMIN only)
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectPost(@PathVariable Long id,
            @RequestBody(required = false) Map<String, String> requestBody,
            Authentication authentication) {
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

        // Check permissions
        if (user.getRole() != Role.EDITOR && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only editors and admins can reject posts"));
        }

        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found"));
        }

        Post post = postOpt.get();

        if (post.getStatus() != PostStatus.UNDER_REVIEW) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Only pending posts can be rejected"));
        }

        // Reject and send back to draft with comments
        post.setStatus(PostStatus.REJECTED);
        if (requestBody != null && requestBody.containsKey("reason")) {
            post.setReviewComments(requestBody.get("reason"));
        }
        post.setReviewedBy(user);
        post.setReviewedAt(LocalDateTime.now());

        try {
            Post updatedPost = postRepository.save(post);
            postHistoryService.trackStatusChange(updatedPost, user, PostStatus.UNDER_REVIEW, PostStatus.REJECTED);

            return ResponseEntity.ok(Map.of(
                    "message", "Post rejected successfully",
                    "post", updatedPost));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to reject post: " + e.getMessage()));
        }
    }

    // Unsubmit post - Writer retracts submission back to DRAFT
    @PostMapping("/{id}/unsubmit")
    public ResponseEntity<?> unsubmitPost(@PathVariable Long id, Authentication authentication) {
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
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found"));
        }

        Post post = postOpt.get();

        // Verify user owns the post
        if (!post.getCreatedBy().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You can only unsubmit your own posts"));
        }

        // Verify post is under review
        if (post.getStatus() != PostStatus.UNDER_REVIEW) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Only posts under review can be unsubmitted"));
        }

        try {
            // Retract to draft
            post.setStatus(PostStatus.DRAFT);
            post.setSubmittedAt(null);
            post.setLastModifiedBy(user);
            Post updatedPost = postRepository.save(post);

            postHistoryService.trackStatusChange(updatedPost, user, PostStatus.UNDER_REVIEW, PostStatus.DRAFT);

            return ResponseEntity.ok(Map.of(
                    "message", "Post retracted to draft successfully",
                    "post", updatedPost));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to unsubmit post: " + e.getMessage()));
        }
    }

    // Get pending approvals (EDITOR/ADMIN only)
    @GetMapping("/pending-approvals")
    public ResponseEntity<?> getPendingApprovals(Authentication authentication) {
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

        // Check permissions
        if (user.getRole() != Role.EDITOR && user.getRole() != Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Only editors and admins can view pending approvals"));
        }

        List<Post> pendingPosts = postRepository.findByStatus(PostStatus.UNDER_REVIEW);

        return ResponseEntity.ok(Map.of(
                "pendingApprovals", pendingPosts,
                "count", pendingPosts.size()));
    }
}
