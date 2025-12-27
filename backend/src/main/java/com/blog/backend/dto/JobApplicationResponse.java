package com.blog.backend.dto;

import com.blog.backend.model.JobApplication;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationResponse {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private ApplicantInfo applicant;
    private String coverLetter;
    private String resumeUrl;
    private String email;
    private String phone;
    private JobApplication.ApplicationStatus status;
    private LocalDateTime appliedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApplicantInfo {
        private Long id;
        private String displayName;
        private String email;
    }

    public static JobApplicationResponse fromApplication(JobApplication application) {
        JobApplicationResponse response = new JobApplicationResponse();
        response.setId(application.getId());
        response.setJobId(application.getJob().getId());
        response.setJobTitle(application.getJob().getTitle());

        ApplicantInfo applicantInfo = new ApplicantInfo();
        applicantInfo.setId(application.getApplicant().getId());
        applicantInfo.setDisplayName(application.getApplicant().getDisplayName());
        applicantInfo.setEmail(application.getApplicant().getEmail());
        response.setApplicant(applicantInfo);

        response.setCoverLetter(application.getCoverLetter());
        response.setResumeUrl(application.getResumeUrl());
        response.setEmail(application.getEmail());
        response.setPhone(application.getPhone());
        response.setStatus(application.getStatus());
        response.setAppliedAt(application.getAppliedAt());

        return response;
    }
}
