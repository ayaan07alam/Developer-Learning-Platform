package com.blog.backend.repository;

import com.blog.backend.model.PostRevision;
import com.blog.backend.model.RevisionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRevisionRepository extends JpaRepository<PostRevision, Long> {

        // Find all revisions for a specific post
        List<PostRevision> findByOriginalPostId(Long postId);

        // Find active draft for a post (DRAFT or PENDING_REVIEW status)
        @Query("SELECT r FROM PostRevision r WHERE r.originalPost.id = :postId " +
                        "AND (r.status = 'DRAFT' OR r.status = 'PENDING_REVIEW') " +
                        "ORDER BY r.updatedAt DESC")
        Optional<PostRevision> findActiveDraftByPostId(@Param("postId") Long postId);

        // Find all revisions by status
        List<PostRevision> findByStatus(RevisionStatus status);

        // Find revisions by creator
        @Query("SELECT r FROM PostRevision r WHERE r.createdBy.id = :userId ORDER BY r.updatedAt DESC")
        List<PostRevision> findByCreatorId(@Param("userId") Long userId);

        // Check if a post has an active draft
        @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM PostRevision r " +
                        "WHERE r.originalPost.id = :postId AND (r.status = 'DRAFT' OR r.status = 'PENDING_REVIEW')")
        boolean existsActiveDraftForPost(@Param("postId") Long postId);

        // Find revisions by created user
        List<PostRevision> findByCreatedBy(com.blog.backend.model.User user);
}
