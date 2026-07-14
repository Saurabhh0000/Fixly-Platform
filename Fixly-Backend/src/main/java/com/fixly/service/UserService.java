package com.fixly.service;

import com.fixly.dto.request.ChangePasswordRequest;

import com.fixly.entity.User;

public interface UserService {

	void changePassword(String email, ChangePasswordRequest request);

	User findByEmail(String email);

}
