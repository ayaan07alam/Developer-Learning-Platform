package com.blog.backend.dto;

import com.blog.backend.model.JobCategory;
import com.blog.backend.model.JobType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateJobRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    private String requirements;

    @NotNull(message = "Job category is required")
    private JobCategory category;

    @NotNull(message = "Job type is required")
    private JobType jobType;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @DecimalMin(value = "0.0", inclusive = false, message = "Minimum salary must be positive")
    private BigDecimal salaryMin;

    @DecimalMin(value = "0.0", inclusive = false, message = "Maximum salary must be positive")
    private BigDecimal salaryMax;

    @NotBlank(message = "Company name is required")
    @Size(max = 255, message = "Company name must not exceed 255 characters")
    private String companyName;

    private String companyDescription;

    private String companyLogo;

    private String applicationUrl;

    @Email(message = "Invalid email format")
    private String applicationEmail;

    // Removed @Future validation - deadline is optional and can be any future date
    private LocalDate deadline;

    private Boolean publishImmediately = true; // If false, save as draft
}
