package com.fixly.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.fixly.dto.response.ContactAdminResponse;
import com.fixly.dto.response.PageResponse;
import com.fixly.enums.ContactStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fixly.dto.request.ContactRequest;
import com.fixly.dto.response.ContactResponse;
import com.fixly.exception.BadRequestException;
import com.fixly.service.ContactService;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    @Autowired
    private ContactService contactService;

    @GetMapping("/history")
    public ResponseEntity<PageResponse<ContactAdminResponse>> getMyContactHistory(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        ContactStatus parsedStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                parsedStatus = ContactStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid contact status.");
            }
        }

        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        return ResponseEntity.ok(contactService.getMyContactHistory(parsedStatus, search, pageable));
    }

    @PostMapping
    public ResponseEntity<ContactResponse> submitContact(@RequestBody ContactRequest request) {
        ContactResponse response = contactService.submitContactMessage(request);
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ContactResponse> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ContactResponse.fail(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ContactResponse> handleUnexpected(Exception ex) {
        log.error("Unexpected error handling /api/contact", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ContactResponse.fail("Unable to process your request. Please try again shortly."));
    }
}