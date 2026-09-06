package com.fixly.service;

import org.springframework.data.domain.Pageable;

import com.fixly.dto.request.ContactStatusUpdateRequest;
import com.fixly.dto.response.ContactAdminResponse;
import com.fixly.dto.response.PageResponse;
import com.fixly.enums.ContactReason;
import com.fixly.enums.ContactStatus;
import com.fixly.enums.ContactUserType;

public interface AdminContactService {

    PageResponse<ContactAdminResponse> getAllContacts(
            ContactUserType userType, ContactStatus status, ContactReason reason, String search, Pageable pageable);

    ContactAdminResponse getContactById(Long id);

    ContactAdminResponse updateStatus(Long id, ContactStatusUpdateRequest request);
}