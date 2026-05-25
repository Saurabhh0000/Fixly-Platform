package com.fixly.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fixly.dto.request.LoginRequest;
import com.fixly.dto.request.RegisterRequest;
import com.fixly.dto.response.AuthResponse;
import com.fixly.entity.Address;
import com.fixly.entity.User;
import com.fixly.enums.ProviderStatus;
import com.fixly.enums.Role;
import com.fixly.repository.ServiceProviderRepository;
import com.fixly.repository.UserRepository;
import com.fixly.service.AuthService;
import com.fixly.exception.BadRequestException;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    /* ================= REGISTER ================= */
    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // 🔐 USER ONLY (IMPORTANT)
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(Role.USER); // ✅ ALWAYS USER
        user.setActive(true);
        user.setPassword(encoder.encode(request.getPassword()));

        // 📍 ADDRESS
        Address address = new Address();
        address.setCity(request.getCity());
        address.setArea(request.getArea());
        address.setPincode(request.getPincode());
        address.setUser(user);

        user.setAddresses(List.of(address));

        userRepo.save(user);

        // 📦 RESPONSE
        AuthResponse response = new AuthResponse();
        response.setId(user.getUserId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setMessage("Registration successful");

        return response;
    }

    /* ================= LOGIN ================= */
    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        AuthResponse response = new AuthResponse();
        response.setId(user.getUserId());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole().name());
        response.setMessage("Login successful");

        // ================= PROVIDER STATUS CHECK =================

        serviceProviderRepository
                .findByUser_UserId(user.getUserId())
                .ifPresent(provider -> {

                    // ❌ SUSPENDED PROVIDER

                    if (provider.getStatus() == ProviderStatus.SUSPENDED) {

                        throw new BadRequestException(
                                "Your provider account is suspended");
                    }

                    // ✅ APPROVED PROVIDER

                    if (provider.getStatus() == ProviderStatus.APPROVED) {

                        response.setProviderId(
                                provider.getProviderId());

                        response.setRole(
                                Role.PROVIDER.name());
                    }
                });

        return response;
    }
}
