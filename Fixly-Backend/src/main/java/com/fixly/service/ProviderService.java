package com.fixly.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fixly.dto.request.ProviderRegisterRequest;
import com.fixly.dto.response.ProviderResponse;
import com.fixly.dto.response.ProviderSearchResponse;
import com.fixly.dto.response.ProviderStatusResponse;
import com.fixly.dto.response.ProviderVerificationResponse;

public interface ProviderService {

	ProviderResponse registerProvider(
			ProviderRegisterRequest request,
			MultipartFile aadhaarFrontImage,
			MultipartFile aadhaarBackImage);

	List<ProviderSearchResponse> searchProviders(String category, String city);

	// Provider Verification Process

	List<ProviderVerificationResponse> getAllProviders();

	ProviderResponse approveProvider(Long providerId);

	ProviderResponse rejectProvider(Long providerId);

	ProviderResponse verifyProvider(Long providerId);

	ProviderResponse suspendProvider(Long providerId);

	ProviderResponse unsuspendProvider(Long providerId);

	ProviderStatusResponse getProviderStatus(
			Long userId);

}
