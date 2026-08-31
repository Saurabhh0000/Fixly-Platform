package com.fixly.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fixly.entity.ContactMessage;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}