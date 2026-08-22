package com.fixly.dto.request;

import lombok.Data;

@Data
public class ChatRequest {

    private String message;

    private String lastIntent;
}