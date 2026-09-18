package com.fixly.service;

import java.util.List;

import com.fixly.dto.request.AddressRequest;
import com.fixly.dto.response.AddressResponse;

public interface AddressService {

    AddressResponse addAddress(Long id, AddressRequest request, String authenticatedEmail);

    List<AddressResponse> getUserAddress(Long id, String authenticatedEmail);

    AddressResponse updateAddress(Long addressId, AddressRequest request, String authenticatedEmail);

    void deleteAddress(Long addressId, String authenticatedEmail);

    List<String> getAllCities();
}
