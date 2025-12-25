package com.blog.backend.dto;

import com.blog.backend.model.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {

    private Long id;
    private String title;
    private String description;
    private String requirements;
    private JobCategory category;
    private JobType jobType;
    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String companyName;
    private String companyDescription;
    private String companyLogo;
    private String applicationUrl;
    private String applicationEmail;
    private LocalDate deadline;
    private JobStatus status;
    private Integer applicantsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Employer info (only if user is the poster or admin)
    private EmployerInfo postedBy;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployerInfo {
        private Long id;
        private String username;
        private String email;
    }

    public static JobResponse fromJob(Job job, boolean includeEmployerInfo) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setDescription(job.getDescription());
        response.setRequirements(job.getRequirements());
        response.setCategory(job.getCategory());
        response.setJobType(job.getJobType());
        response.setLocation(job.getLocation());
        response.setSalaryMin(job.getSalaryMin());
        response.setSalaryMax(job.getSalaryMax());
        response.setCompanyName(job.getCompanyName());
        response.setCompanyDescription(job.getCompanyDescription());
        response.setCompanyLogo(job.getCompanyLogo());
        response.setApplicationUrl(job.getApplicationUrl());
        response.setApplicationEmail(job.getApplicationEmail());
        response.setDeadline(job.getDeadline());
        response.setStatus(job.getStatus());
        response.setApplicantsCount(job.getApplicantsCount());
        response.setCreatedAt(job.getCreatedAt());
        response.setUpdatedAt(job.getUpdatedAt());

        if (includeEmployerInfo && job.getPostedBy() != null) {
            EmployerInfo employerInfo = new EmployerInfo();
            employerInfo.setId(job.getPostedBy().getId());
            employerInfo.setUsername(job.getPostedBy().getUsername());
            employerInfo.setEmail(job.getPostedBy().getEmail());
            response.setPostedBy(employerInfo);
        }

        return response;
    }
}
