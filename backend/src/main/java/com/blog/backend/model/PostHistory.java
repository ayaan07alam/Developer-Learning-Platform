package com.blog.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "post_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "modified_by", nullable = false)
    private User modifiedBy;

    @Column(nullable = false)
    private String action; // CREATED, EDITED, SUBMITTED_FOR_REVIEW, APPROVED, REJECTED, PUBLISHED, etc.

    @Column(columnDefinition = "TEXT")
    private String changeDescription;

    @Enumerated(EnumType.STRING)
    private PostStatus oldStatus;

    @Enumerated(EnumType.STRING)
    private PostStatus newStatus;

    @Column(name = "post_version")
    private Long postVersion;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
