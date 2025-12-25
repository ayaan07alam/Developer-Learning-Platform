package com.blog.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ApplyJobRequest {

    @NotBlank(message = "Cover letter is required")
    @Size(max = 5000, message = "Cover letter must not exceed 5000 characters")
    private String coverLetter;

    private String resumeUrl; // Optional: link to uploaded resume

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phone;
}
