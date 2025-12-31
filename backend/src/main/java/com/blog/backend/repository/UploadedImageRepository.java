package com.blog.backend.repository;

import com.blog.backend.model.UploadedImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UploadedImageRepository extends JpaRepository<UploadedImage, Long> {
    // Basic CRUD is enough
    List<UploadedImage> findAllByOrderByCreatedAtDesc();
}
