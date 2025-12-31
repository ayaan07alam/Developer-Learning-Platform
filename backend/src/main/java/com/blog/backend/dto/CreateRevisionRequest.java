package com.blog.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CreateRevisionRequest {
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private String mainImage;
    private String featuredImage;
    private String metaTitle;
    private String metaDescription;
    private List<String> tags;
    private List<Long> categoryIds;
    private Long authorId;
    private List<FAQDTO> faqs;
    private String tocItems;
    private Boolean showToc;
    private String revisionNotes;
}
