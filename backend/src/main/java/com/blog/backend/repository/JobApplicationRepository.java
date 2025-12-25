package com.blog.backend.repository;

import com.blog.backend.model.Job;
import com.blog.backend.model.JobApplication;
import com.blog.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    // Find all applications for a specific job
    List<JobApplication> findByJobOrderByAppliedAtDesc(Job job);

    // Find all applications by a user
    List<JobApplication> findByApplicantOrderByAppliedAtDesc(User applicant);

    // Check if user already applied to a job
    boolean existsByJobAndApplicant(Job job, User applicant);

    // Find specific application
    Optional<JobApplication> findByJobAndApplicant(Job job, User applicant);

    // Count applications for a job
    long countByJob(Job job);

    // Count applications by status for a job
    long countByJobAndStatus(Job job, JobApplication.ApplicationStatus status);
}
