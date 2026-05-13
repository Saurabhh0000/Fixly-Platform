package com.fixly.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fixly.dto.response.ProviderResponse;
import com.fixly.dto.response.ProviderVerificationResponse;
import com.fixly.service.ProviderService;

@RestController
@RequestMapping("/api/admin/providers")
@CrossOrigin
public class AdminProviderController {

    @Autowired
    private ProviderService providerService;

    @GetMapping
    public ResponseEntity<List<ProviderVerificationResponse>> getAllProviders() {

        return ResponseEntity.ok(
                providerService.getAllProviders());
    }

    @PutMapping("/{providerId}/verify")
    public ResponseEntity<ProviderResponse> verifyProvider(@PathVariable Long providerId) {

        return ResponseEntity.ok(
                providerService.verifyProvider(providerId));
    }

    @PutMapping("/{providerId}/approve")
    public ResponseEntity<ProviderResponse> approveProvider(@PathVariable Long providerId) {

        return ResponseEntity.ok(
                providerService.approveProvider(providerId));
    }

    @PutMapping("/{providerId}/reject")
    public ResponseEntity<ProviderResponse> rejectProvider(@PathVariable Long providerId) {

        return ResponseEntity.ok(
                providerService.rejectProvider(providerId));
    }

    @PutMapping("/{providerId}/suspend")
    public ResponseEntity<ProviderResponse> suspendProvider(@PathVariable Long providerId) {

        return ResponseEntity.ok(
                providerService.suspendProvider(providerId));
    }

    @PutMapping("/{providerId}/unsuspend")
    public ResponseEntity<ProviderResponse> unsuspendProvider(@PathVariable Long providerId) {

        return ResponseEntity.ok(
                providerService.unsuspendProvider(providerId));
    }
}
