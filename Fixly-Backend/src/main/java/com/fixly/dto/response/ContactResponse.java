package com.fixly.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactResponse {
    private boolean success;
    private String message;

    public static ContactResponse ok(String message) {
        return new ContactResponse(true, message);
    }

    public static ContactResponse fail(String message) {
        return new ContactResponse(false, message);
    }
}