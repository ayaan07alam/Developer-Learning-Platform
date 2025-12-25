package com.blog.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String username;
    private String role; // Changed from Role enum to String for JSON serialization
    private String oauthProvider;
    private LocalDateTime createdAt;
    private String bio;
    private String profilePhoto;
}
