package com.fixly.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.fixly.entity.ContactMessage;

public interface ContactMessageRepository
        extends JpaRepository<ContactMessage, Long>, JpaSpecificationExecutor<ContactMessage> {
}