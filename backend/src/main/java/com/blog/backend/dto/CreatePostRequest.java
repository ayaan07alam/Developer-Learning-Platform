package com.blog.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.blog.backend.model.PostStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreatePostRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must be less than 200 characters")
    private String title;

    private String slug; // Auto-generated if not provided

    private PostStatus status = PostStatus.DRAFT;

    private String mainImage;
    private String featuredImage;

    @Size(max = 500, message = "Excerpt must be less than 500 characters")
    private String excerpt;

    private String content; // HTML content

    private String metaTitle;
    private String metaDescription;

    private Long authorId;
    private Set<Long> categoryIds = new HashSet<>();
    private List<String> tags = new ArrayList<>();
    private String tocItems; // JSON string
    private Boolean showToc = true;
    private List<FAQDTO> faqs = new ArrayList<>();
}
