package com.blog.backend.dto;

import lombok.Data;
import java.util.List;

@Data
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
