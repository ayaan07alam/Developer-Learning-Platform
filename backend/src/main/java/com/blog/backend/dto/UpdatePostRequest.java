package com.blog.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.blog.backend.model.PostStatus;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class UpdatePostRequest {
    private String title;
    private String slug;
    private PostStatus status;
    private String mainImage;
    private String featuredImage;
    private String excerpt;
    private String content;
    private String metaTitle;
    private String metaDescription;
    private Long authorId;
    private Set<Long> categoryIds = new HashSet<>();
    private List<String> tags = new ArrayList<>();
    private String tocItems; // JSON string
    private Boolean showToc;
    private List<FAQDTO> faqs = new ArrayList<>();
}
