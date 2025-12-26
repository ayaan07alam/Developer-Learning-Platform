package com.blog.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import jakarta.persistence.OrderBy;
import com.blog.backend.model.PostInternalComment;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = { "categories", "author", "createdBy", "lastModifiedBy", "faqs" })
@EqualsAndHashCode(exclude = { "categories", "author", "createdBy", "lastModifiedBy", "faqs" })
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(unique = true, nullable = false)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status = PostStatus.DRAFT;

    // Images
    private String mainImage; // Featured/cover image URL
    private String featuredImage; // Alternative featured image

    // Content
    @Column(columnDefinition = "TEXT")
    private String excerpt; // Short description for SEO and previews

    @Lob
    @Column(columnDefinition = "TEXT")
    private String content; // Rich text content (HTML)

    // SEO
    private String metaTitle;

    @Column(columnDefinition = "TEXT")
    private String metaDescription;

    // Analytics
    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer viewCount = 0;

    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer readTime = 0; // in minutes

    // Versioning
    @Version
    private Long version;

    // Timestamps
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    private LocalDateTime publishedAt;

    // Relationships
    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "last_modified_by")
    private User lastModifiedBy;

    // Review workflow fields
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    private LocalDateTime reviewedAt;

    @Column(columnDefinition = "TEXT")
    private String reviewComments;

    @ManyToMany
    @JoinTable(name = "post_categories", joinColumns = @JoinColumn(name = "post_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    // Engagement metrics
    @Column(name = "like_count")
    private Integer likeCount = 0;

    @Column(name = "comment_count")
    private Integer commentCount = 0;

    @Column(name = "toc_items", columnDefinition = "TEXT")
    private String tocItems; // JSON array of TOC items

    @Column(name = "show_toc")
    private Boolean showToc = true; // Whether to display TOC on live site

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FAQ> faqs = new ArrayList<>();

    // Internal comments for team discussion
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("post")
    private List<PostInternalComment> internalComments = new ArrayList<>();
}
