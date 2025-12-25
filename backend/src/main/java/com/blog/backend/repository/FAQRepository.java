package com.blog.backend.repository;

import com.blog.backend.model.FAQ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {

    List<FAQ> findByPostIdOrderByDisplayOrder(Long postId);

    void deleteByPostId(Long postId);
}
