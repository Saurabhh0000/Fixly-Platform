package com.fixly.service;

import com.fixly.dto.request.ContactRequest;
import com.fixly.dto.response.ContactResponse;

public interface ContactService {
    ContactResponse submitContactMessage(ContactRequest request);
}