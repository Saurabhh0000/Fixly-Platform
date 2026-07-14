package com.fixly.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.fixly.dto.response.NotificationResponse;
import com.fixly.entity.Notification;
import com.fixly.entity.User;
import com.fixly.service.NotificationService;
import com.fixly.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(Authentication authentication) {

        User user = userService.findByEmail(authentication.getName());

        return ResponseEntity.ok(notificationService.getUserNotifications(user.getUserId()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(@PathVariable Long id) {

        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PutMapping("/read-all")
    public void markAll(Authentication authentication) {

        User user = userService.findByEmail(authentication.getName());

        notificationService.markAllAsRead(user.getUserId());
    }

    @GetMapping("/count")
    public long unreadCount(Authentication authentication) {

        User user = userService.findByEmail(authentication.getName());

        return notificationService.getUnreadCount(user.getUserId());
    }
}