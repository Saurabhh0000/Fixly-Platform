package com.fixly.service;

import java.util.List;

import com.fixly.dto.request.AddressRequest;
import com.fixly.dto.response.AddressResponse;

public interface AddressService {
	
	AddressResponse addAddress(Long id, AddressRequest request);
	List<AddressResponse> getUserAddress(Long id);
	List<String> getAllCities();
	

}
