package com.blog.backend.controller;

import com.blog.backend.dto.CreateRevisionRequest;
import com.blog.backend.dto.FAQDTO;
import com.blog.backend.model.*;
import com.blog.backend.repository.*;
import com.blog.backend.service.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/revisions")
@CrossOrigin(origins = "*")
public class PostRevisionController {

    @Autowired
    private PostRevisionRepository revisionRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PermissionService permissionService;

    /**
     * Create a new revision from a published post
     * POST /api/posts/{postId}/revisions
     */
    @PostMapping("/posts/{postId}")
    public ResponseEntity<?> createRevision(@PathVariable Long postId, Authentication authentication) {
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

        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Post not found"));
        }
        Post post = postOpt.get();

        // Check permissions
        if (!permissionService.canEditPost(user, post)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to edit this post"));
        }

        // Check if there's already an active draft
        Optional<PostRevision> existingDraft = revisionRepository.findActiveDraftByPostId(postId);
        if (existingDraft.isPresent()) {
            return ResponseEntity.ok(existingDraft.get());
        }

        // Create new revision from the published post
        PostRevision revision = new PostRevision();
        revision.setOriginalPost(post);
        revision.setStatus(RevisionStatus.DRAFT);
        revision.setCreatedBy(user);

        // Copy all fields from the original post
        revision.setTitle(post.getTitle());
        revision.setSlug(post.getSlug());
        revision.setMainImage(post.getMainImage());
        revision.setFeaturedImage(post.getFeaturedImage());
        revision.setExcerpt(post.getExcerpt());
        revision.setContent(post.getContent());
        revision.setMetaTitle(post.getMetaTitle());
        revision.setMetaDescription(post.getMetaDescription());
        revision.setReadTime(post.getReadTime());
        revision.setAuthor(post.getAuthor());
        revision.setCategories(new HashSet<>(post.getCategories()));
        revision.setTags(new ArrayList<>(post.getTags()));
        revision.setTocItems(post.getTocItems());
        revision.setShowToc(post.getShowToc());

        // Copy FAQs
        for (FAQ faq : post.getFaqs()) {
            RevisionFAQ revFaq = new RevisionFAQ();
            revFaq.setRevision(revision);
            revFaq.setQuestion(faq.getQuestion());
            revFaq.setAnswer(faq.getAnswer());
            revFaq.setDisplayOrder(faq.getDisplayOrder());
            revision.getFaqs().add(revFaq);
        }

        PostRevision savedRevision = revisionRepository.save(revision);
        return ResponseEntity.ok(savedRevision);
    }

    /**
     * Get active draft revision for a post
     * GET /api/posts/{postId}/revisions/active
     */
    @GetMapping("/posts/{postId}/active")
    public ResponseEntity<?> getActiveDraft(@PathVariable Long postId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        Optional<PostRevision> revision = revisionRepository.findActiveDraftByPostId(postId);
        if (revision.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "No active draft found"));
        }

        return ResponseEntity.ok(revision.get());
    }

    /**
     * Update a revision
     * PUT /api/revisions/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateRevision(
            @PathVariable Long id,
            @RequestBody CreateRevisionRequest request,
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

        Optional<PostRevision> revisionOpt = revisionRepository.findById(id);
        if (revisionOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Revision not found"));
        }

        PostRevision revision = revisionOpt.get();

        // Check permissions
        if (!permissionService.canEditPost(user, revision.getOriginalPost())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to edit this revision"));
        }

        // Update fields
        if (request.getTitle() != null)
            revision.setTitle(request.getTitle());
        if (request.getSlug() != null)
            revision.setSlug(request.getSlug());
        if (request.getMainImage() != null)
            revision.setMainImage(request.getMainImage());
        if (request.getFeaturedImage() != null)
            revision.setFeaturedImage(request.getFeaturedImage());
        if (request.getExcerpt() != null)
            revision.setExcerpt(request.getExcerpt());
        if (request.getContent() != null) {
            revision.setContent(request.getContent());
            // Recalculate read time
            int wordCount = request.getContent().split("\\s+").length;
            revision.setReadTime((int) Math.ceil(wordCount / 200.0));
        }
        if (request.getMetaTitle() != null)
            revision.setMetaTitle(request.getMetaTitle());
        if (request.getMetaDescription() != null)
            revision.setMetaDescription(request.getMetaDescription());
        if (request.getTags() != null)
            revision.setTags(request.getTags());
        if (request.getTocItems() != null)
            revision.setTocItems(request.getTocItems());
        if (request.getShowToc() != null)
            revision.setShowToc(request.getShowToc());
        if (request.getRevisionNotes() != null)
            revision.setRevisionNotes(request.getRevisionNotes());

        revision.setLastModifiedBy(user);

        // Update author
        if (request.getAuthorId() != null) {
            authorRepository.findById(request.getAuthorId())
                    .ifPresent(revision::setAuthor);
        }

        // Update categories
        if (request.getCategoryIds() != null) {
            Set<Category> categories = new HashSet<>();
            for (Long catId : request.getCategoryIds()) {
                categoryRepository.findById(catId).ifPresent(categories::add);
            }
            revision.setCategories(categories);
        }

        // Update FAQs
        if (request.getFaqs() != null) {
            revision.getFaqs().clear();
            for (FAQDTO faqDTO : request.getFaqs()) {
                RevisionFAQ faq = new RevisionFAQ();
                faq.setRevision(revision);
                faq.setQuestion(faqDTO.getQuestion());
                faq.setAnswer(faqDTO.getAnswer());
                faq.setDisplayOrder(faqDTO.getDisplayOrder());
                revision.getFaqs().add(faq);
            }
        }

        PostRevision savedRevision = revisionRepository.save(revision);
        return ResponseEntity.ok(savedRevision);
    }

    /**
     * Publish a revision (apply changes to original post)
     * POST /api/revisions/{id}/publish
     */
    @PostMapping("/{id}/publish")
    public ResponseEntity<?> publishRevision(@PathVariable Long id, Authentication authentication) {
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

        Optional<PostRevision> revisionOpt = revisionRepository.findById(id);
        if (revisionOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Revision not found"));
        }

        PostRevision revision = revisionOpt.get();
        Post post = revision.getOriginalPost();

        // Check permissions - must be able to publish
        if (!permissionService.canPublishPost(user, post)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to publish this post"));
        }

        // Apply revision changes to the original post
        post.setTitle(revision.getTitle());
        post.setSlug(revision.getSlug());
        post.setMainImage(revision.getMainImage());
        post.setFeaturedImage(revision.getFeaturedImage());
        post.setExcerpt(revision.getExcerpt());
        post.setContent(revision.getContent());
        post.setMetaTitle(revision.getMetaTitle());
        post.setMetaDescription(revision.getMetaDescription());
        post.setReadTime(revision.getReadTime());
        post.setAuthor(revision.getAuthor());
        post.setCategories(new HashSet<>(revision.getCategories()));
        post.setTags(new ArrayList<>(revision.getTags()));
        post.setTocItems(revision.getTocItems());
        post.setShowToc(revision.getShowToc());
        post.setLastModifiedBy(user);
        post.setStatus(PostStatus.PUBLISHED);

        // If this is the first publication
        if (post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }

        // Update FAQs
        post.getFaqs().clear();
        for (RevisionFAQ revFaq : revision.getFaqs()) {
            FAQ faq = new FAQ();
            faq.setPost(post);
            faq.setQuestion(revFaq.getQuestion());
            faq.setAnswer(revFaq.getAnswer());
            faq.setDisplayOrder(revFaq.getDisplayOrder());
            post.getFaqs().add(faq);
        }

        Post savedPost = postRepository.save(post);

        // Mark revision as approved and published
        revision.setStatus(RevisionStatus.APPROVED);
        revision.setPublishedAt(LocalDateTime.now());
        revisionRepository.save(revision);

        return ResponseEntity.ok(savedPost);
    }

    /**
     * Discard a revision
     * DELETE /api/revisions/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> discardRevision(@PathVariable Long id, Authentication authentication) {
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

        Optional<PostRevision> revisionOpt = revisionRepository.findById(id);
        if (revisionOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Revision not found"));
        }

        PostRevision revision = revisionOpt.get();

        // Check permissions
        if (!permissionService.canEditPost(user, revision.getOriginalPost())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You don't have permission to discard this revision"));
        }

        // Mark as discarded instead of deleting
        revision.setStatus(RevisionStatus.DISCARDED);
        revisionRepository.save(revision);

        return ResponseEntity.ok(Map.of("message", "Revision discarded successfully"));
    }

    /**
     * Get all revisions for a post (for history/audit)
     * GET /api/posts/{postId}/revisions
     */
    @GetMapping("/posts/{postId}")
    public ResponseEntity<?> getPostRevisions(@PathVariable Long postId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        List<PostRevision> revisions = revisionRepository.findByOriginalPostId(postId);
        return ResponseEntity.ok(revisions);
    }
}
