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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import com.fixly.dto.request.ProviderRegisterRequest;
import com.fixly.dto.response.ProviderResponse;
import com.fixly.dto.response.ProviderSearchResponse;
import com.fixly.dto.response.ProviderStatusResponse;

import com.fixly.service.ProviderService;

@RestController
@RequestMapping("/api/providers")
@CrossOrigin
public class ProviderController {

	@Autowired
	private ProviderService providerService;

	@PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ProviderResponse> registerProvider(

			@RequestParam Long userId,

			@RequestParam Long categoryId,

			@RequestParam int experienceYears,

			@RequestParam double pricePerVisit,

			@RequestParam String panCardNumber,

			@RequestParam String aadhaarNumber,

			@RequestParam MultipartFile aadhaarFrontImage,

			@RequestParam MultipartFile aadhaarBackImage) {

		ProviderRegisterRequest request = new ProviderRegisterRequest();

		request.setUserId(userId);
		request.setCategoryId(categoryId);
		request.setExperienceYears(experienceYears);
		request.setPricePerVisit(pricePerVisit);
		request.setPanCardNumber(panCardNumber);
		request.setAadhaarNumber(aadhaarNumber);

		ProviderResponse provider = providerService.registerProvider(
				request,
				aadhaarFrontImage,
				aadhaarBackImage);

		return ResponseEntity.ok(provider);
	}

	@GetMapping("/search")
	public ResponseEntity<List<ProviderSearchResponse>> searchProviders(@RequestParam String category,
			@RequestParam String city) {
		return ResponseEntity.ok(providerService.searchProviders(category, city));
	}

	@GetMapping("/status/{userId}")
	public ResponseEntity<ProviderStatusResponse> getProviderStatus(
			@PathVariable Long userId) {

		return ResponseEntity.ok(
				providerService.getProviderStatus(userId));
	}

}
