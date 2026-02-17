package com.blog.backend.service;

import com.blog.backend.model.Notification;
import com.blog.backend.model.NotificationType;
import com.blog.backend.model.Role;
import com.blog.backend.model.User;
import com.blog.backend.repository.NotificationRepository;
import com.blog.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public Notification createNotification(User recipient, String message, NotificationType type) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setMessage(message);
        notification.setType(type);

        Notification savedNotification = notificationRepository.save(notification);

        // Send Email
        String subject = type == NotificationType.ROLE_PROMOTION ? "Role Promotion Notification" : "New Notification";
        emailService.sendEmail(recipient.getEmail(), subject, message);

        return savedNotification;
    }

    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findAllByRecipientIdOrderByCreatedAtDesc(user.getId());
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(user.getId());
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void broadcastNotification(String message, Role targetRole) {
        List<User> users;
        if (targetRole == null) {
            users = userRepository.findAll();
        } else {
            users = userRepository.findByRole(targetRole);
        }

        for (User user : users) {
            createNotification(user, message, NotificationType.ADMIN_BROADCAST);
        }
    }

    public void sendToUser(String email, String message) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User with email " + email + " not found"));
        createNotification(user, message, NotificationType.ADMIN_BROADCAST);
    }
}
