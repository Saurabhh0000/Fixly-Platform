package com.fixly.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fixly.dto.request.ContactStatusUpdateRequest;
import com.fixly.dto.response.ContactAdminResponse;
import com.fixly.dto.response.PageResponse;
import com.fixly.entity.ContactMessage;
import com.fixly.entity.User;
import com.fixly.enums.ContactReason;
import com.fixly.enums.ContactStatus;
import com.fixly.enums.ContactUserType;
import com.fixly.exception.BadRequestException;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.ContactMessageRepository;
import com.fixly.repository.ContactMessageSpecification;
import com.fixly.service.AdminContactService;

import java.time.LocalDateTime;

@Service
public class AdminContactServiceImpl implements AdminContactService {

    private static final Logger log = LoggerFactory.getLogger(AdminContactServiceImpl.class);

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ContactAdminResponse> getAllContacts(
            ContactUserType userType, ContactStatus status, ContactReason reason, String search, Pageable pageable) {
        Page<ContactMessage> page = contactMessageRepository.findAll(
                ContactMessageSpecification.withFilters(userType, status, reason, search), pageable);
        return PageResponse.from(page.map(this::toAdminResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public ContactAdminResponse getContactById(Long id) {
        ContactMessage entity = findOrThrow(id);
        return toAdminResponse(entity);
    }

    @Override
    @Transactional
    public ContactAdminResponse updateStatus(Long id, ContactStatusUpdateRequest request) {
        if (request == null || request.getStatus() == null || request.getStatus().isBlank()) {
            throw new BadRequestException("Status is required.");
        }

        ContactStatus newStatus;
        try {
            newStatus = ContactStatus.valueOf(request.getStatus().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status.");
        }

        ContactMessage entity = findOrThrow(id);
        ContactStatus oldStatus = entity.getStatus();

        validateTransition(oldStatus, newStatus);

        entity.setStatus(newStatus);
        if (newStatus == ContactStatus.RESOLVED) {
            entity.setResolvedAt(LocalDateTime.now());
        } else if (oldStatus == ContactStatus.RESOLVED && newStatus == ContactStatus.IN_PROGRESS) {
            // Reopening a resolved query — clear the resolved timestamp.
            entity.setResolvedAt(null);
        }

        contactMessageRepository.save(entity);
        log.info("Admin status update: contactId={}, oldStatus={}, newStatus={}", id, oldStatus, newStatus);

        return toAdminResponse(entity);
    }

    /**
     * Defined transitions: NEW -> IN_PROGRESS, NEW -> RESOLVED,
     * IN_PROGRESS -> RESOLVED, RESOLVED -> IN_PROGRESS (reopen). Setting a
     * status to itself is a no-op and allowed. Anything else is rejected.
     */
    private void validateTransition(ContactStatus from, ContactStatus to) {
        if (from == to)
            return;

        boolean allowed = switch (from) {
            case NEW -> to == ContactStatus.IN_PROGRESS || to == ContactStatus.RESOLVED;
            case IN_PROGRESS -> to == ContactStatus.RESOLVED;
            case RESOLVED -> to == ContactStatus.IN_PROGRESS;
        };

        if (!allowed) {
            throw new BadRequestException("Cannot change status from " + from + " to " + to + ".");
        }
    }

    private ContactMessage findOrThrow(Long id) {
        return contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact query not found."));
    }

    private ContactAdminResponse toAdminResponse(ContactMessage entity) {
        User user = entity.getUser();
        return ContactAdminResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .subject(entity.getSubject())
                .message(entity.getMessage())
                .reason(entity.getReason())
                .userType(entity.getUserType())
                .status(entity.getStatus())
                .userId(user != null ? user.getUserId() : null)
                .userName(user != null ? user.getFullName() : null)
                .userEmail(user != null ? user.getEmail() : null)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .resolvedAt(entity.getResolvedAt())
                .build();
    }
}