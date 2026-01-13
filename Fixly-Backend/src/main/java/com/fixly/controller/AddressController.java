package com.fixly.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fixly.dto.request.AddressRequest;
import com.fixly.dto.response.AddressResponse;
import com.fixly.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin
public class AddressController {
	
	@Autowired
	private AddressService addressService;
	
    // Add address

	@PostMapping("/{id}")
	public ResponseEntity<AddressResponse> addAddress(@PathVariable Long id, @RequestBody AddressRequest request)
	{
		AddressResponse response = addressService.addAddress(id, request);
		
		return ResponseEntity.ok(response);
	}
	
    // Get user addresses

	@GetMapping("/{id}")
	public ResponseEntity<List<AddressResponse>> getUserAddresses(@PathVariable Long id)
	{
		List<AddressResponse> userAddress = addressService.getUserAddress(id);
		
		return ResponseEntity.ok(userAddress);
	}
	// ✅ GET ALL CITIES (FIXED)
    @GetMapping("/cities")
    public ResponseEntity<List<String>> getAllCities() {
        return ResponseEntity.ok(addressService.getAllCities());
    }

}
