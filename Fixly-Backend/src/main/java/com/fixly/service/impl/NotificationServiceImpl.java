package com.fixly.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fixly.dto.response.NotificationResponse;
import com.fixly.entity.Notification;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.NotificationRepository;
import com.fixly.repository.UserRepository;
import com.fixly.service.NotificationService;
import com.fixly.entity.User;
import com.fixly.enums.NotificationType;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public Notification create(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public List<NotificationResponse> getUserNotifications(Long userId) {

        return notificationRepository
                .findByUserUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public NotificationResponse markAsRead(Long notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);

        Notification saved = notificationRepository.save(notification);

        return mapToResponse(saved);
    }

    private NotificationResponse mapToResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .referenceId(n.getReferenceId())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }

    @Override
    public void markAllAsRead(Long userId) {

        List<Notification> notifications = notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);

        notifications.forEach(n -> n.setRead(true));

        notificationRepository.saveAll(notifications);
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserUserIdAndReadFalse(userId);
    }

    @Override
    public void send(Long userId, String title, String message, NotificationType type) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);

        notificationRepository.save(notification);
    }
}