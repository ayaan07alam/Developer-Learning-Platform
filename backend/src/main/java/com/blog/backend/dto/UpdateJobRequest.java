package com.blog.backend.dto;

import com.blog.backend.model.JobCategory;
import com.blog.backend.model.JobType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateJobRequest {

    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    private String description;

    private String requirements;

    private JobCategory category;

    private JobType jobType;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @DecimalMin(value = "0.0", inclusive = false, message = "Minimum salary must be positive")
    private BigDecimal salaryMin;

    @DecimalMin(value = "0.0", inclusive = false, message = "Maximum salary must be positive")
    private BigDecimal salaryMax;

    @Size(max = 255, message = "Company name must not exceed 255 characters")
    private String companyName;

    private String companyDescription;

    private String companyLogo;

    @Pattern(regexp = "^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$", message = "Invalid URL format")
    private String applicationUrl;

    @Email(message = "Invalid email format")
    private String applicationEmail;

    private LocalDate deadline;
}
