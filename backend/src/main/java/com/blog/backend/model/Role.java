package com.blog.backend.model;

public enum Role {
    USER, // Regular user
    WRITER, // Contributor - can write but not publish
    ADMIN, // Full access: create, edit, delete posts, manage users
    EDITOR, // Can create and edit posts
    REVIEWER, // Can view posts and add comments
    VIEWER // Read-only access
}
