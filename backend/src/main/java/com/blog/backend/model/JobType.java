package com.blog.backend.model;

public enum JobType {
    FULL_TIME("Full Time"),
    PART_TIME("Part Time"),
    CONTRACT("Contract"),
    REMOTE("Remote"),
    HYBRID("Hybrid"),
    ON_SITE("On-site"),
    INTERNSHIP("Internship"),
    FREELANCE("Freelance");

    private final String label;

    JobType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
