package com.fixly.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fixly.entity.Notification;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserUserIdAndReadFalse(Long userId);

}
