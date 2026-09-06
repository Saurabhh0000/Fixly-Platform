package com.fixly.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fixly.chat.AuthenticatedUserResolver;
import com.fixly.dto.request.ContactRequest;
import com.fixly.dto.response.ContactResponse;
import com.fixly.entity.ContactMessage;
import com.fixly.entity.User;
import com.fixly.enums.ContactReason;
import com.fixly.enums.ContactUserType;
import com.fixly.enums.Role;
import com.fixly.exception.BadRequestException;
import com.fixly.repository.ContactMessageRepository;
import com.fixly.service.ContactService;

@Service
public class ContactServiceImpl implements ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactServiceImpl.class);

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @Autowired
    private AuthenticatedUserResolver authenticatedUserResolver;

    @Override
    public ContactResponse submitContactMessage(ContactRequest request) {
        if (request == null
                || isBlank(request.getName())
                || isBlank(request.getEmail())
                || isBlank(request.getSubject())
                || isBlank(request.getMessage())) {
            throw new BadRequestException("Please complete the required fields before sending your message.");
        }

        if (!isBlank(request.getReason()) && parseReason(request.getReason()) == null) {
            throw new BadRequestException("Invalid contact reason.");
        }

        // Role is NEVER read from the request body — it is derived solely
        // from the authenticated Spring Security context.
        User authenticatedUser = authenticatedUserResolver.resolveCurrentUserOrNull();
        ContactUserType userType = resolveUserType(authenticatedUser);

        ContactMessage entity = new ContactMessage();
        entity.setUser(userType == ContactUserType.GUEST ? null : authenticatedUser);
        entity.setUserType(userType);
        // Snapshot the submitted contact details, not the account profile —
        // preserves historical accuracy even if the profile changes later.
        entity.setName(request.getName().trim());
        entity.setEmail(request.getEmail().trim());
        entity.setPhone(isBlank(request.getPhone()) ? null : request.getPhone().trim());
        entity.setSubject(request.getSubject().trim());
        entity.setMessage(request.getMessage().trim());
        entity.setReason(parseReason(request.getReason()));

        try {
            ContactMessage saved = contactMessageRepository.save(entity);
            log.info("Contact query created: contactId={}, userType={}", saved.getId(), userType);
        } catch (Exception e) {
            log.error("Failed to save contact message from {}", request.getEmail(), e);
            return ContactResponse.fail("Unable to process your request.");
        }

        return ContactResponse.ok("Your message has been received successfully.");
    }

    private ContactUserType resolveUserType(User user) {
        if (user == null) {
            return ContactUserType.GUEST;
        }
        Role role = user.getRole();
        if (role == Role.USER) {
            return ContactUserType.USER;
        }
        if (role == Role.PROVIDER) {
            return ContactUserType.PROVIDER;
        }
        // ADMIN (or any unexpected role) is not a supported submitter on
        // this public endpoint — admins manage queries, they don't file
        // them here, and no business case for it was specified.
        throw new BadRequestException(
                "Contact submissions from this account type are not supported on this endpoint.");
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