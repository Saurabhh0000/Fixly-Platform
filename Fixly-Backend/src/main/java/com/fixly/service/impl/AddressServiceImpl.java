package com.fixly.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fixly.dto.request.AddressRequest;
import com.fixly.dto.response.AddressResponse;
import com.fixly.entity.Address;
import com.fixly.entity.User;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.AddressRepository;
import com.fixly.repository.UserRepository;
import com.fixly.service.AddressService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService{
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private AddressRepository addressRepo;

	@Override
	public AddressResponse addAddress(Long id, AddressRequest request) {
		
		User user = userRepo.findById(id).orElseThrow(()-> new ResourceNotFoundException("User Not Found"));
		
		Address newAddress = new Address();
		
		newAddress.setCity(request.getCity());
		newAddress.setArea(request.getArea());
		newAddress.setPincode(request.getPincode());
		newAddress.setUser(user);
		
		Address saved = addressRepo.save(newAddress);
		
		return mapToResponse(saved);
	}

	@Override
	public List<AddressResponse> getUserAddress(Long id) {
		
		List<Address> userId = addressRepo.findByUserUserId(id);
		
		return userId.stream().map(this::mapToResponse).collect(Collectors.toList());
	}
	
	private AddressResponse mapToResponse(Address address)
	{
		AddressResponse response = new AddressResponse();
		response.setId(address.getAddressId());
		response.setCity(address.getCity());
		response.setArea(address.getArea());
		response.setPincode(address.getPincode());
		
		return response;
	}

	@Override
	public List<String> getAllCities() {
		return addressRepo.findDistinctCities();
	}

}
