package com.blog.backend.repository;

import com.blog.backend.model.Post;
import com.blog.backend.model.PostHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostHistoryRepository extends JpaRepository<PostHistory, Long> {
    List<PostHistory> findByPostOrderByCreatedAtDesc(Post post);

    List<PostHistory> findByPostIdOrderByCreatedAtDesc(Long postId);

    void deleteByPostId(Long postId);
}
