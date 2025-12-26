package com.blog.backend.model;

public enum RevisionStatus {
    DRAFT("Draft"),
    PENDING_REVIEW("Pending Review"),
    APPROVED("Approved"),
    DISCARDED("Discarded");

    private final String displayName;

    RevisionStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
