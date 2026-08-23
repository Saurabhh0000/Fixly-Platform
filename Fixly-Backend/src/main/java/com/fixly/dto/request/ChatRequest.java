package com.fixly.dto.request;

import lombok.Data;

@Data
public class ChatRequest {

    private String message;

    /**
     * Optional. The `intent` string from the assistant's PREVIOUS response in
     * this session, echoed back by the frontend so short follow-up replies
     * ("Deep cleaning", "Kitchen tap") can be understood in context.
     * Purely optional — omit it and the assistant still works, just without
     * follow-up continuity.
     */
    private String lastIntent;
}