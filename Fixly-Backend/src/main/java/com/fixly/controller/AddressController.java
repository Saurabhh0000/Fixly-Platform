package com.fixly.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.fixly.dto.request.AddressRequest;
import com.fixly.dto.response.AddressResponse;
import com.fixly.service.AddressService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @PostMapping("/{id}")
    public ResponseEntity<AddressResponse> addAddress(
            @PathVariable Long id,
            @RequestBody AddressRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                addressService.addAddress(id, request, authentication.getName())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<AddressResponse>> getUserAddresses(
            @PathVariable Long id,
            Authentication authentication) {

        return ResponseEntity.ok(
                addressService.getUserAddress(id, authentication.getName())
        );
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long addressId,
            @RequestBody AddressRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                addressService.updateAddress(addressId, request, authentication.getName())
        );
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long addressId,
            Authentication authentication) {

        addressService.deleteAddress(addressId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAllCities() {
        return ResponseEntity.ok(addressService.getAllCities());
    }
}
