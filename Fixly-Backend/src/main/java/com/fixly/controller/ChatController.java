package com.fixly.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fixly.dto.request.ChatRequest;
import com.fixly.dto.response.ChatResponse;
import com.fixly.exception.BadRequestException;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.service.ChatService;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        ChatResponse response = chatService.handleMessage(request);
        return ResponseEntity.ok(response);
    }

    /*
     * These are scoped to ChatController only — they take precedence over
     * any project-wide @ControllerAdvice for requests to /api/chat, but
     * don't touch or override error handling anywhere else in the app.
     * Without these, an unmapped BadRequestException/ResourceNotFoundException
     * thrown by ChatService would fall through to Spring's default error
     * page as a raw 500, even though ChatServiceImpl explicitly rethrows
     * them expecting some handler to translate them properly.
     */

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String, String>> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorBody("BAD_REQUEST", ex.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorBody("NOT_FOUND", ex.getMessage()));
    }

    /*
     * Last-resort safety net for anything truly unexpected (NPEs, lazy-init
     * issues, etc.) that ChatServiceImpl's own internal try/catch didn't
     * already turn into a friendly ChatResponse. Logs the real exception
     * server-side; the client only ever sees a generic message, per the
     * "never expose stack traces" requirement.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleUnexpected(Exception ex) {
        log.error("Unexpected error handling /api/chat", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorBody("INTERNAL_ERROR", "Something went wrong. Please try again in a moment."));
    }

    private Map<String, String> errorBody(String error, String message) {
        Map<String, String> body = new LinkedHashMap<>();
        body.put("error", error);
        body.put("message", message);
        return body;
    }
}