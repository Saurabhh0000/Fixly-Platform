package com.fixly.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fixly.entity.Notification;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.NotificationRepository;
import com.fixly.repository.UserRepository;
import com.fixly.service.NotificationService;
import com.fixly.entity.User;
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
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Notification markAsRead(Long notificationId) {

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setRead(true);

        return notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(Long userId) {

        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        notifications.forEach(n -> n.setRead(true));

        notificationRepository.saveAll(notifications);
    }

    @Override
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Override
    public void send(Long userId, String title, String message) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);

        notificationRepository.save(notification);
    }
}