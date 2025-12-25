package com.blog.backend.repository;

import com.blog.backend.model.Media;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByUploadedByIdOrderByUploadedAtDesc(Long userId);
}
