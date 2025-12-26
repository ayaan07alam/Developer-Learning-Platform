package com.blog.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "revision_faqs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RevisionFAQ {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "revision_id", nullable = false)
    private PostRevision revision;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column(name = "display_order")
    private Integer displayOrder = 0;
}
