package com.fixly.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fixly.dto.response.NotificationResponse;
import com.fixly.entity.Notification;
import com.fixly.enums.NotificationType;

@Service
public interface NotificationService {

    Notification create(Notification notification);

    List<NotificationResponse> getUserNotifications(Long userId);

    NotificationResponse markAsRead(Long notificationId);

    void markAllAsRead(Long userId);

    long getUnreadCount(Long userId);

    void send(Long userId, String title, String message, NotificationType type);

}
