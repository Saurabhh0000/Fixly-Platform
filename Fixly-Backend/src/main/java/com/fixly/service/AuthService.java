package com.fixly.service;

import com.fixly.dto.request.LoginRequest;
import com.fixly.dto.request.RegisterRequest;
import com.fixly.dto.response.AuthResponse;

public interface AuthService {
	
	AuthResponse register(RegisterRequest request);
	AuthResponse login(LoginRequest request);

}
