package com.blog.backend.service;

import com.blog.backend.model.Post;
import com.blog.backend.model.PostHistory;
import com.blog.backend.model.PostStatus;
import com.blog.backend.model.User;
import com.blog.backend.repository.PostHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostHistoryService {

    @Autowired
    private PostHistoryRepository postHistoryRepository;

    /**
     * Create a history entry for a post action
     */
    public void createHistoryEntry(Post post, User user, String action, String description,
            PostStatus oldStatus, PostStatus newStatus) {
        PostHistory history = new PostHistory();
        history.setPost(post);
        history.setModifiedBy(user);
        history.setAction(action);
        history.setChangeDescription(description);
        history.setOldStatus(oldStatus);
        history.setNewStatus(newStatus);
        history.setPostVersion(post.getVersion());
        postHistoryRepository.save(history);
    }

    /**
     * Track post creation
     */
    public void trackCreation(Post post, User user) {
        createHistoryEntry(post, user, "CREATED", "Post created", null, post.getStatus());
    }

    /**
     * Track post update
     */
    public void trackUpdate(Post post, User user, String changeDescription) {
        createHistoryEntry(post, user, "UPDATED", changeDescription, null, post.getStatus());
    }

    /**
     * Track post deletion
     */
    public void trackDeletion(Post post, User user) {
        createHistoryEntry(post, user, "DELETED", "Post deleted", post.getStatus(), null);
    }

    /**
     * Track status change
     */
    public void trackStatusChange(Post post, User user, PostStatus oldStatus, PostStatus newStatus) {
        String description = String.format("Status changed from %s to %s",
                oldStatus != null ? oldStatus.getDisplayName() : "None",
                newStatus != null ? newStatus.getDisplayName() : "None");
        createHistoryEntry(post, user, "STATUS_CHANGED", description, oldStatus, newStatus);
    }
}
