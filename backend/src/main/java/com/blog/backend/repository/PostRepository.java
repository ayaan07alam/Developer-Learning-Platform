package com.blog.backend.repository;

import com.blog.backend.model.Post;
import com.blog.backend.model.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findBySlug(String slug);

    List<Post> findByStatus(PostStatus status);
}
