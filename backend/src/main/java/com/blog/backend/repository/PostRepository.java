package com.blog.backend.repository;

import com.blog.backend.model.Post;
import com.blog.backend.model.PostStatus;
import com.blog.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findBySlug(String slug);

    List<Post> findByStatus(PostStatus status);

    // Pagination support
    Page<Post> findByStatus(PostStatus status, Pageable pageable);

    Page<Post> findByCreatedBy(User user, Pageable pageable);

    Page<Post> findByCreatedByAndStatus(User user, PostStatus status, Pageable pageable);

    Page<Post> findByCreatedByAndTitleContainingIgnoreCase(User user, String title, Pageable pageable);

    Page<Post> findByCreatedByAndStatusAndTitleContainingIgnoreCase(User user, PostStatus status, String title,
            Pageable pageable);

    Page<Post> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Post> findByStatusAndTitleContainingIgnoreCase(PostStatus status, String title, Pageable pageable);

    Page<Post> findByStatusAndCreatedBy(PostStatus status, User user, Pageable pageable);

    Page<Post> findByStatusAndCreatedByAndTitleContainingIgnoreCase(PostStatus status, User user, String title,
            Pageable pageable);

    // Count methods for statistics
    long countByCreatedBy(User user);

    long countByCreatedByAndStatus(User user, PostStatus status);
}
