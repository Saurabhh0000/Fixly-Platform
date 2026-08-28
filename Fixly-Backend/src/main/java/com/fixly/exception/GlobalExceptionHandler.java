package com.fixly.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<?> handleBadRequest(
                        BadRequestException ex) {

                Map<String, String> error = new HashMap<>();

                error.put(
                                "message",
                                ex.getMessage());

                return ResponseEntity
                                .badRequest()
                                .body(error);
        }

        // Was previously unmapped and fell through to a generic 500 —
        // this is additive, doesn't change any existing mapped behavior.
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
                Map<String, String> error = new HashMap<>();
                error.put("message", ex.getMessage());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<?> handleAccessDenied(AccessDeniedException ex) {
                Map<String, String> error = new HashMap<>();
                error.put("message", ex.getMessage());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<?> handleValidation(MethodArgumentNotValidException ex) {
                Map<String, String> error = new HashMap<>();
                ex.getBindingResult().getFieldErrors().forEach(fe -> error.put(fe.getField(), fe.getDefaultMessage()));
                return ResponseEntity.badRequest().body(error);
        }

        @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
        public ResponseEntity<?> handleOptimisticLock(ObjectOptimisticLockingFailureException ex) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "This record was just updated elsewhere. Please refresh and try again.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }
}