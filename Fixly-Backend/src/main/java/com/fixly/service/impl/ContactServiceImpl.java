package com.fixly.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fixly.dto.request.ContactRequest;
import com.fixly.dto.response.ContactResponse;
import com.fixly.entity.ContactMessage;
import com.fixly.enums.ContactReason;
import com.fixly.exception.BadRequestException;
import com.fixly.repository.ContactMessageRepository;
import com.fixly.service.ContactService;

@Service
public class ContactServiceImpl implements ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactServiceImpl.class);

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Override
    public ContactResponse submitContactMessage(ContactRequest request) {
        // Minimal technical safety only — the frontend owns user-facing
        // field-level validation. This guards persistence against
        // malformed/empty requests, not a duplicate validation layer.
        if (request == null
                || isBlank(request.getName())
                || isBlank(request.getEmail())
                || isBlank(request.getSubject())
                || isBlank(request.getMessage())) {
            throw new BadRequestException("Please complete the required fields before sending your message.");
        }

        ContactMessage entity = new ContactMessage();
        entity.setName(request.getName().trim());
        entity.setEmail(request.getEmail().trim());
        entity.setPhone(isBlank(request.getPhone()) ? null : request.getPhone().trim());
        entity.setSubject(request.getSubject().trim());
        entity.setMessage(request.getMessage().trim());
        entity.setReason(parseReason(request.getReason()));

        try {
            contactMessageRepository.save(entity);
        } catch (Exception e) {
            log.error("Failed to save contact message from {}", request.getEmail(), e);
            return ContactResponse.fail("Unable to process your request.");
        }

        return ContactResponse.ok("Your message has been received successfully.");
    }

    private ContactReason parseReason(String raw) {
        if (isBlank(raw))
            return null;
        try {
            return ContactReason.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}