package com.fixly.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fixly.dto.request.ContactStatusUpdateRequest;
import com.fixly.dto.response.ContactAdminResponse;
import com.fixly.dto.response.PageResponse;
import com.fixly.enums.ContactReason;
import com.fixly.enums.ContactStatus;
import com.fixly.enums.ContactUserType;
import com.fixly.exception.BadRequestException;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.service.AdminContactService;

/**
 * Access to this entire controller is enforced at the SecurityConfig layer
 * (/api/admin/contact/** -> hasRole("ADMIN")), not here — this class does
 * not re-derive or trust any role information from the request.
 */
@RestController
@RequestMapping("/api/admin/contact")
public class AdminContactController {

    private static final Logger log = LoggerFactory.getLogger(AdminContactController.class);

    @Autowired
    private AdminContactService adminContactService;

    @GetMapping
    public ResponseEntity<PageResponse<ContactAdminResponse>> listContacts(
            @RequestParam(required = false) String userType,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String reason,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        ContactUserType parsedUserType = parseEnum(ContactUserType.class, userType, "userType");
        ContactStatus parsedStatus = parseEnum(ContactStatus.class, status, "status");
        ContactReason parsedReason = parseEnum(ContactReason.class, reason, "reason");

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        PageResponse<ContactAdminResponse> result = adminContactService.getAllContacts(parsedUserType, parsedStatus,
                parsedReason, search, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactAdminResponse> getContact(@PathVariable Long id) {
        return ResponseEntity.ok(adminContactService.getContactById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ContactAdminResponse> updateStatus(
            @PathVariable Long id, @RequestBody ContactStatusUpdateRequest request) {
        return ResponseEntity.ok(adminContactService.updateStatus(id, request));
    }

    private <E extends Enum<E>> E parseEnum(Class<E> type, String raw, String paramName) {
        if (raw == null || raw.isBlank())
            return null;
        try {
            return Enum.valueOf(type, raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid " + paramName + ".");
        }
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleUnexpected(Exception ex) {
        log.error("Unexpected error in /api/admin/contact", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Unable to process your request. Please try again shortly.");
    }
}