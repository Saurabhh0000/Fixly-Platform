package com.fixly.service;

import com.fixly.dto.request.ContactRequest;
import com.fixly.dto.response.ContactResponse;
import com.fixly.dto.response.ContactAdminResponse;
import com.fixly.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;
import com.fixly.enums.ContactStatus;

public interface ContactService {
    ContactResponse submitContactMessage(ContactRequest request);

    PageResponse<ContactAdminResponse> getMyContactHistory(ContactStatus status, String search, Pageable pageable);
}