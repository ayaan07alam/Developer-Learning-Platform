package com.blog.backend.service;

import com.blog.backend.model.Post;
import com.blog.backend.model.Role;
import com.blog.backend.model.User;
import org.springframework.stereotype.Service;

@Service
public class PermissionService {

    /**
     * Check if user can edit a post
     * ADMIN, EDITOR, REVIEWER: Can edit (REVIEWER only own/assigned technically but
     * handled in controller)
     */
    public boolean canEditPost(User user, Post post) {
        if (user == null)
            return false;
        return user.getRole() == Role.ADMIN ||
                user.getRole() == Role.EDITOR ||
                user.getRole() == Role.REVIEWER;
    }

    /**
     * Check if user can delete a post
     * ADMIN: Can delete any post
     * Others: Cannot delete
     */
    public boolean canDeletePost(User user, Post post) {
        if (user == null)
            return false;
        return user.getRole() == Role.ADMIN;
    }

    /**
     * Check if user can publish/unpublish a post
     * ADMIN: Can publish any post
     * EDITOR: Can publish any post
     * Others: Cannot publish
     */
    public boolean canPublishPost(User user, Post post) {
        if (user == null)
            return false;
        return user.getRole() == Role.ADMIN || user.getRole() == Role.EDITOR;
    }

    /**
     * Check if user can view analytics (views, likes, comments stats)
     * ADMIN: Can view all analytics
     * Others: Cannot view analytics
     */
    public boolean canViewAnalytics(User user) {
        if (user == null)
            return false;
        return user.getRole() == Role.ADMIN;
    }

    /**
     * Check if user can manage other users (assign roles, delete users)
     * ADMIN: Can manage users
     * Others: Cannot manage users
     */
    public boolean canManageUsers(User user) {
        if (user == null)
            return false;
        return user.getRole() == Role.ADMIN;
    }

    /**
     * Check if user can review posts (approve/reject)
     * ADMIN: Can review
     * (REVIEWER cannot approve/reject, only edit/submit)
     */
    public boolean canReviewPost(User user) {
        if (user == null)
            return false;
        return user.getRole() == Role.ADMIN;
    }

    /**
     * Check if user can create new posts
     * All authenticated users can create posts (viewer = writer)
     * USER: Can create (submit for approval)
     * WRITER: Can create (submit for approval)
     * EDITOR: Can create and publish
     * ADMIN: Can create and publish
     */
    public boolean canCreatePost(User user) {
        if (user == null)
            return false;
        // Allow all authenticated users to create posts
        return user.getRole() == Role.USER ||
                user.getRole() == Role.WRITER ||
                user.getRole() == Role.EDITOR ||
                user.getRole() == Role.ADMIN;
    }

    /**
     * Check if user can manage categories
     * ADMIN: Can manage
     * EDITOR: Can manage
     * Others: Cannot manage
     */
    public boolean canManageCategories(User user) {
        if (user == null)
            return false;
        return user.getRole() == Role.ADMIN || user.getRole() == Role.EDITOR;
    }

    /**
     * Check if user can view user list
     * ADMIN: Can view and manage
     * EDITOR: Can view (read-only)
     * Others: Cannot view
     */
    public boolean canViewUserList(User user) {
        if (user == null)
            return false;
        return user.getRole() == Role.ADMIN || user.getRole() == Role.EDITOR;
    }

    /**
     * Check if user has dashboard access
     * ADMIN, EDITOR, REVIEWER: Have dashboard access
     * USER: No dashboard access
     */
    public boolean hasDashboardAccess(User user) {
        if (user == null)
            return false;
        return user.getRole() == Role.ADMIN ||
                user.getRole() == Role.EDITOR ||
                user.getRole() == Role.REVIEWER;
    }
}
