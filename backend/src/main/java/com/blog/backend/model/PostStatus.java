package com.blog.backend.model;

public enum PostStatus {
    DRAFT("Draft"),
    UNDER_REVIEW("Under Review"),
    APPROVED("Approved"),
    PUBLISHED("Published"),
    REJECTED("Rejected"),
    ARCHIVED("Archived");

    private final String displayName;

    PostStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
