package com.fixly.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fixly.entity.Notification;

@Service
public interface NotificationService {

    Notification create(Notification notification);

    List<Notification> getUserNotifications(Long userId);

    Notification markAsRead(Long notificationId);

    void markAllAsRead(Long userId);

    long getUnreadCount(Long userId);

    void send(Long userId, String title, String message);

}
