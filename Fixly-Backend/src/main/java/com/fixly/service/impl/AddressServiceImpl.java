package com.fixly.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fixly.dto.request.AddressRequest;
import com.fixly.dto.response.AddressResponse;
import com.fixly.entity.Address;
import com.fixly.entity.User;
import com.fixly.enums.NotificationType;
import com.fixly.exception.BadRequestException;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.AddressRepository;\nimport com.fixly.repository.BookingRepository;
import com.fixly.repository.UserRepository;
import com.fixly.service.AddressService;
import com.fixly.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final UserRepository userRepo;
    private final AddressRepository addressRepo;\n    private final BookingRepository bookingRepo;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public AddressResponse addAddress(Long id, com.fixly.dto.request.AddressRequest request, String authenticatedEmail) {

        User authenticatedUser = getAuthenticatedUser(authenticatedEmail);
        ensureSameUser(id, authenticatedUser);

        Address newAddress = new Address();
        newAddress.setCity(clean(request.getCity()));
        newAddress.setArea(clean(request.getArea()));
        newAddress.setPincode(clean(request.getPincode()));
        newAddress.setUser(authenticatedUser);

        validate(newAddress);

        Address saved = addressRepo.save(newAddress);

        notificationService.send(
                authenticatedUser.getUserId(),
                "Address added",
                "Your address in " + saved.getArea() + ", " + saved.getCity() + " has been saved successfully.",
                NotificationType.ADDRESS);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressResponse> getUserAddress(Long id, String authenticatedEmail) {

        User authenticatedUser = getAuthenticatedUser(authenticatedEmail);
        ensureSameUser(id, authenticatedUser);

        return addressRepo.findByUserUserId(id)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AddressResponse updateAddress(Long addressId, com.fixly.dto.request.AddressRequest request,
            String authenticatedEmail) {

        User user = getAuthenticatedUser(authenticatedEmail);

        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        ensureAddressOwner(address, user);

        address.setCity(clean(request.getCity()));
        address.setArea(clean(request.getArea()));
        address.setPincode(clean(request.getPincode()));

        validate(address);

        Address saved = addressRepo.save(address);

        notificationService.send(
                user.getUserId(),
                "Address updated",
                "Your address in " + saved.getArea() + ", " + saved.getCity() + " was updated successfully.",
                NotificationType.ADDRESS);

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteAddress(Long addressId, String authenticatedEmail) {

        User user = getAuthenticatedUser(authenticatedEmail);

        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        ensureAddressOwner(address, user);

        String location = clean(address.getArea()) + ", " + clean(address.getCity());

        addressRepo.delete(address);

        notificationService.send(
                user.getUserId(),
                "Address removed",
                "Your saved address in " + location + " has been removed successfully.",
                NotificationType.ADDRESS);
    }

    @Override
    public List<String> getAllCities() {
        return addressRepo.findDistinctCities();
    }

    private User getAuthenticatedUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }

    private void ensureSameUser(Long requestedUserId, User authenticatedUser) {
        if (!authenticatedUser.getUserId().equals(requestedUserId)) {
            throw new BadRequestException("You can only access your own addresses");
        }
    }

    private void ensureAddressOwner(Address address, User user) {
        if (address.getUser() == null || !user.getUserId().equals(address.getUser().getUserId())) {
            throw new BadRequestException("You can only manage your own addresses");
        }
    }

    private void validate(Address address) {
        if (address.getCity() == null || address.getCity().isBlank()
                || address.getArea() == null || address.getArea().isBlank()
                || address.getPincode() == null || !address.getPincode().matches("\\d{6}")) {
            throw new BadRequestException("City, area and a valid 6-digit pincode are required");
        }
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }

    private AddressResponse mapToResponse(Address address) {
        AddressResponse response = new AddressResponse();
        response.setId(address.getAddressId());
        response.setCity(address.getCity());
        response.setArea(address.getArea());
        response.setPincode(address.getPincode());
        return response;
    }
}
