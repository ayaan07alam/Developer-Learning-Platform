package com.blog.backend.repository;

import com.blog.backend.model.RevisionFAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RevisionFAQRepository extends JpaRepository<RevisionFAQ, Long> {
}
