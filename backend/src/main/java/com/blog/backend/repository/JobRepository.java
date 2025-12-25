package com.blog.backend.repository;

import com.blog.backend.model.Job;
import com.blog.backend.model.JobCategory;
import com.blog.backend.model.JobStatus;
import com.blog.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    // Find all active jobs
    List<Job> findByStatusOrderByCreatedAtDesc(JobStatus status);

    // Find jobs by employer
    List<Job> findByPostedByOrderByCreatedAtDesc(User postedBy);

    // Find jobs by category
    List<Job> findByCategoryAndStatusOrderByCreatedAtDesc(JobCategory category, JobStatus status);

    // Search jobs by title or company name
    @Query("SELECT j FROM Job j WHERE j.status = :status AND (LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Job> searchJobs(@Param("keyword") String keyword, @Param("status") JobStatus status);

    // Count jobs by employer
    long countByPostedBy(User postedBy);

    // Count active jobs by employer
    long countByPostedByAndStatus(User postedBy, JobStatus status);
}
