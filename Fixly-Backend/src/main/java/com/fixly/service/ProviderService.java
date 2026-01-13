package com.fixly.service;

import java.util.List;

import com.fixly.dto.request.ProviderRegisterRequest;
import com.fixly.dto.response.ProviderResponse;
import com.fixly.dto.response.ProviderSearchResponse;

public interface ProviderService {
	
	ProviderResponse registerProvider(ProviderRegisterRequest request);
	List<ProviderSearchResponse> searchProviders(String category, String city);

}
