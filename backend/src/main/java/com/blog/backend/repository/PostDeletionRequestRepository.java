package com.blog.backend.repository;

import com.blog.backend.model.DeletionRequestStatus;
import com.blog.backend.model.PostDeletionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostDeletionRequestRepository extends JpaRepository<PostDeletionRequest, Long> {

    List<PostDeletionRequest> findByStatusOrderByCreatedAtDesc(DeletionRequestStatus status);

    Optional<PostDeletionRequest> findByPostIdAndStatus(Long postId, DeletionRequestStatus status);

    List<PostDeletionRequest> findByRequestedByIdOrderByCreatedAtDesc(Long userId);
}
