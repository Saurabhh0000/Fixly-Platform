package com.fixly.service;

import com.fixly.dto.request.ChangePasswordRequest;

public interface UserService {
	
	void changePassword(String email, ChangePasswordRequest request);

}
