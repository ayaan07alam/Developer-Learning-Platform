package com.blog.backend.controller;

import com.blog.backend.dto.*;
import com.blog.backend.model.*;
import com.blog.backend.repository.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    // Get all active jobs (public, requires auth)
    @GetMapping
    public ResponseEntity<?> getAllJobs(
            @RequestParam(required = false) JobCategory category,
            @RequestParam(required = false) String search,
            Authentication authentication) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            List<Job> jobs;

            if (search != null && !search.trim().isEmpty()) {
                jobs = jobRepository.searchJobs(search, JobStatus.ACTIVE);
            } else if (category != null) {
                jobs = jobRepository.findByCategoryAndStatusOrderByCreatedAtDesc(category, JobStatus.ACTIVE);
            } else {
                jobs = jobRepository.findByStatusOrderByCreatedAtDesc(JobStatus.ACTIVE);
            }

            List<JobResponse> response = jobs.stream()
                    .map(job -> JobResponse.fromJob(job, false))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch jobs: " + e.getMessage()));
        }
    }

    // Get job by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getJobById(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            Optional<Job> jobOpt = jobRepository.findById(id);
            if (jobOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Job not found"));
            }

            Job job = jobOpt.get();
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);

            boolean includeEmployerInfo = userOpt.isPresent() &&
                    (job.getPostedBy().getId().equals(userOpt.get().getId()) ||
                            userOpt.get().getRole() == Role.ADMIN);

            JobResponse response = JobResponse.fromJob(job, includeEmployerInfo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch job: " + e.getMessage()));
        }
    }

    // Create new job (EMPLOYER only)
    @PostMapping
    public ResponseEntity<?> createJob(@Valid @RequestBody CreateJobRequest request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();

            // Check if user has EMPLOYER role
            if (user.getJobRole() != JobRole.EMPLOYER) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only employers can post jobs"));
            }

            // Validate salary range
            if (request.getSalaryMin() != null && request.getSalaryMax() != null &&
                    request.getSalaryMin().compareTo(request.getSalaryMax()) > 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Minimum salary cannot be greater than maximum salary"));
            }

            Job job = new Job();
            job.setTitle(request.getTitle());
            job.setDescription(request.getDescription());
            job.setRequirements(request.getRequirements());
            job.setCategory(request.getCategory());
            job.setJobType(request.getJobType());
            job.setLocation(request.getLocation());
            job.setSalaryMin(request.getSalaryMin());
            job.setSalaryMax(request.getSalaryMax());
            job.setCompanyName(request.getCompanyName());
            job.setCompanyDescription(request.getCompanyDescription());
            job.setCompanyLogo(request.getCompanyLogo());
            job.setApplicationUrl(request.getApplicationUrl());
            job.setApplicationEmail(request.getApplicationEmail());
            job.setDeadline(request.getDeadline());
            job.setStatus(request.getPublishImmediately() ? JobStatus.ACTIVE : JobStatus.DRAFT);
            job.setPostedBy(user);

            Job savedJob = jobRepository.save(job);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(JobResponse.fromJob(savedJob, true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create job: " + e.getMessage()));
        }
    }

    // Update job (EMPLOYER, own jobs only)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id,
            @Valid @RequestBody UpdateJobRequest request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<Job> jobOpt = jobRepository.findById(id);

            if (userOpt.isEmpty() || jobOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User or job not found"));
            }

            User user = userOpt.get();
            Job job = jobOpt.get();

            // Check ownership or admin
            if (!job.getPostedBy().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You can only edit your own jobs"));
            }

            // Update fields if provided
            if (request.getTitle() != null)
                job.setTitle(request.getTitle());
            if (request.getDescription() != null)
                job.setDescription(request.getDescription());
            if (request.getRequirements() != null)
                job.setRequirements(request.getRequirements());
            if (request.getCategory() != null)
                job.setCategory(request.getCategory());
            if (request.getJobType() != null)
                job.setJobType(request.getJobType());
            if (request.getLocation() != null)
                job.setLocation(request.getLocation());
            if (request.getSalaryMin() != null)
                job.setSalaryMin(request.getSalaryMin());
            if (request.getSalaryMax() != null)
                job.setSalaryMax(request.getSalaryMax());
            if (request.getCompanyName() != null)
                job.setCompanyName(request.getCompanyName());
            if (request.getCompanyDescription() != null)
                job.setCompanyDescription(request.getCompanyDescription());
            if (request.getCompanyLogo() != null)
                job.setCompanyLogo(request.getCompanyLogo());
            if (request.getApplicationUrl() != null)
                job.setApplicationUrl(request.getApplicationUrl());
            if (request.getApplicationEmail() != null)
                job.setApplicationEmail(request.getApplicationEmail());
            if (request.getDeadline() != null)
                job.setDeadline(request.getDeadline());

            Job updatedJob = jobRepository.save(job);

            return ResponseEntity.ok(JobResponse.fromJob(updatedJob, true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update job: " + e.getMessage()));
        }
    }

    // Delete job (EMPLOYER, own jobs only)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<Job> jobOpt = jobRepository.findById(id);

            if (userOpt.isEmpty() || jobOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User or job not found"));
            }

            User user = userOpt.get();
            Job job = jobOpt.get();

            // Check ownership or admin
            if (!job.getPostedBy().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You can only delete your own jobs"));
            }

            jobRepository.delete(job);

            return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete job: " + e.getMessage()));
        }
    }

    // Get employer's posted jobs
    @GetMapping("/my-jobs")
    public ResponseEntity<?> getMyJobs(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();

            if (user.getJobRole() != JobRole.EMPLOYER) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only employers can view their posted jobs"));
            }

            List<Job> jobs = jobRepository.findByPostedByOrderByCreatedAtDesc(user);
            List<JobResponse> response = jobs.stream()
                    .map(job -> JobResponse.fromJob(job, true))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch jobs: " + e.getMessage()));
        }
    }

    // Close job posting
    @PostMapping("/{id}/close")
    public ResponseEntity<?> closeJob(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<Job> jobOpt = jobRepository.findById(id);

            if (userOpt.isEmpty() || jobOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User or job not found"));
            }

            User user = userOpt.get();
            Job job = jobOpt.get();

            if (!job.getPostedBy().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You can only close your own jobs"));
            }

            job.setStatus(JobStatus.CLOSED);
            Job closedJob = jobRepository.save(job);

            return ResponseEntity.ok(JobResponse.fromJob(closedJob, true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to close job: " + e.getMessage()));
        }
    }

    // Apply for a job (JOB_SEEKER only)
    @PostMapping("/{id}/apply")
    public ResponseEntity<?> applyForJob(@PathVariable Long id,
            @Valid @RequestBody ApplyJobRequest request,
            Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<Job> jobOpt = jobRepository.findById(id);

            if (userOpt.isEmpty() || jobOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User or job not found"));
            }

            User user = userOpt.get();
            Job job = jobOpt.get();

            if (user.getJobRole() != JobRole.JOB_SEEKER) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only job seekers can apply for jobs"));
            }

            if (job.getStatus() != JobStatus.ACTIVE) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "This job is not accepting applications"));
            }

            // Check if already applied
            if (jobApplicationRepository.existsByJobAndApplicant(job, user)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "You have already applied for this job"));
            }

            JobApplication application = new JobApplication();
            application.setJob(job);
            application.setApplicant(user);
            application.setCoverLetter(request.getCoverLetter());
            application.setResumeUrl(request.getResumeUrl());
            application.setEmail(request.getEmail());
            application.setPhone(request.getPhone());

            JobApplication savedApplication = jobApplicationRepository.save(application);

            // Update applicants count
            job.setApplicantsCount(job.getApplicantsCount() + 1);
            jobRepository.save(job);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(JobApplicationResponse.fromApplication(savedApplication));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to apply for job: " + e.getMessage()));
        }
    }

    // Get applications for a job (EMPLOYER, own jobs only)
    @GetMapping("/{id}/applications")
    public ResponseEntity<?> getJobApplications(@PathVariable Long id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<Job> jobOpt = jobRepository.findById(id);

            if (userOpt.isEmpty() || jobOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User or job not found"));
            }

            User user = userOpt.get();
            Job job = jobOpt.get();

            if (!job.getPostedBy().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "You can only view applications for your own jobs"));
            }

            List<JobApplication> applications = jobApplicationRepository.findByJobOrderByAppliedAtDesc(job);
            List<JobApplicationResponse> response = applications.stream()
                    .map(JobApplicationResponse::fromApplication)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch applications: " + e.getMessage()));
        }
    }

    // Get user's applications (JOB_SEEKER)
    @GetMapping("/my-applications")
    public ResponseEntity<?> getMyApplications(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }

            User user = userOpt.get();

            if (user.getJobRole() != JobRole.JOB_SEEKER) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only job seekers can view their applications"));
            }

            List<JobApplication> applications = jobApplicationRepository.findByApplicantOrderByAppliedAtDesc(user);
            List<JobApplicationResponse> response = applications.stream()
                    .map(JobApplicationResponse::fromApplication)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch applications: " + e.getMessage()));
        }
    }

    // Get job categories (helper endpoint)
    @GetMapping("/categories")
    public ResponseEntity<?> getCategories() {
        return ResponseEntity.ok(Arrays.stream(JobCategory.values())
                .map(cat -> Map.of("value", cat.name(), "label", cat.getLabel()))
                .collect(Collectors.toList()));
    }

    // Get job types (helper endpoint)
    @GetMapping("/types")
    public ResponseEntity<?> getJobTypes() {
        return ResponseEntity.ok(Arrays.stream(JobType.values())
                .map(type -> Map.of("value", type.name(), "label", type.getLabel()))
                .collect(Collectors.toList()));
    }
}
