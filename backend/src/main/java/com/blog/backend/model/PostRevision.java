package com.blog.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "post_revisions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = { "originalPost", "categories", "author", "createdBy" })
@EqualsAndHashCode(exclude = { "originalPost", "categories", "author", "createdBy" })
public class PostRevision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to the original published post this is a revision of
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "original_post_id", nullable = false)
    @JsonIgnore // Prevent circular serialization with Post
    private Post originalPost;

    // Revision status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RevisionStatus status = RevisionStatus.DRAFT;

    // All the same fields as Post
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String slug;

    // Images
    private String mainImage;
    private String featuredImage;

    // Content
    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(columnDefinition = "TEXT")
    private String content;

    // SEO
    private String metaTitle;

    @Column(columnDefinition = "TEXT")
    private String metaDescription;

    // Read time
    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private Integer readTime = 0;

    // Relationships
    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "last_modified_by")
    private User lastModifiedBy;

    // Categories
    @ManyToMany
    @JoinTable(name = "revision_categories", joinColumns = @JoinColumn(name = "revision_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    private Set<Category> categories = new HashSet<>();

    // Tags
    @ElementCollection
    @CollectionTable(name = "revision_tags", joinColumns = @JoinColumn(name = "revision_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    // TOC
    @Column(name = "toc_items", columnDefinition = "TEXT")
    private String tocItems;

    @Column(name = "show_toc")
    private Boolean showToc = true;

    // FAQs for this revision
    @OneToMany(mappedBy = "revision", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RevisionFAQ> faqs = new ArrayList<>();

    // Timestamps
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // When this revision was published (applied to original post)
    private LocalDateTime publishedAt;

    // Revision notes
    @Column(columnDefinition = "TEXT")
    private String revisionNotes;
}
