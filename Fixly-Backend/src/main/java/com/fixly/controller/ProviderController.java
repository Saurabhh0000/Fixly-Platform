package com.fixly.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fixly.dto.request.ProviderRegisterRequest;
import com.fixly.dto.response.ProviderResponse;
import com.fixly.dto.response.ProviderSearchResponse;
import com.fixly.service.ProviderService;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin
public class ProviderController {
	
	@Autowired
	private ProviderService providerService;
	
	@PostMapping("/register")
	public ResponseEntity<ProviderResponse> registerProvider(@RequestBody ProviderRegisterRequest request)
	{
		ProviderResponse provider = providerService.registerProvider(request);
		return ResponseEntity.ok(provider);
	}
	
	 @GetMapping("/search")
	 public ResponseEntity<List<ProviderSearchResponse>> searchProviders(@RequestParam String category, @RequestParam String city) 
	 {
	        return ResponseEntity.ok(providerService.searchProviders(category, city));
	 }

}
