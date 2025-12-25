package com.blog.backend.dto;

import com.blog.backend.model.PostHistory;
import com.blog.backend.model.PostStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostHistoryResponse {
    private Long id;
    private String action;
    private String changeDescription;
    private PostStatus oldStatus;
    private PostStatus newStatus;
    private Long postVersion;
    private String modifiedByName;
    private String modifiedByEmail;
    private LocalDateTime createdAt;

    public static PostHistoryResponse fromPostHistory(PostHistory history) {
        PostHistoryResponse response = new PostHistoryResponse();
        response.setId(history.getId());
        response.setAction(history.getAction());
        response.setChangeDescription(history.getChangeDescription());
        response.setOldStatus(history.getOldStatus());
        response.setNewStatus(history.getNewStatus());
        response.setPostVersion(history.getPostVersion());
        response.setModifiedByName(history.getModifiedBy().getUsername());
        response.setModifiedByEmail(history.getModifiedBy().getEmail());
        response.setCreatedAt(history.getCreatedAt());
        return response;
    }
}
