package com.blog.backend.repository;

import com.blog.backend.model.PostInternalComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternalCommentRepository extends JpaRepository<PostInternalComment, Long> {
    List<PostInternalComment> findByPostIdOrderByCreatedAtDesc(Long postId);
}
