package com.blog.backend.repository;

import com.blog.backend.model.PostView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PostViewRepository extends JpaRepository<PostView, Long> {

    @Query("SELECT COUNT(DISTINCT pv.ipAddress) FROM PostView pv WHERE pv.post.id = ?1")
    Long countUniqueViewsByPostId(Long postId);

    boolean existsByPostIdAndIpAddressAndViewDateAfter(Long postId, String ipAddress, LocalDateTime viewDate);
}
