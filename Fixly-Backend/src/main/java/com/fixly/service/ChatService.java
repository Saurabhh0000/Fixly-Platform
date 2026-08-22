package com.fixly.service;

import com.fixly.dto.request.ChatRequest;
import com.fixly.dto.response.ChatResponse;

public interface ChatService {
    ChatResponse handleMessage(ChatRequest request);
}