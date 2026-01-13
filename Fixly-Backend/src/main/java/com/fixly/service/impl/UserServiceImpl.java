package com.fixly.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fixly.dto.request.ChangePasswordRequest;
import com.fixly.entity.User;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.UserRepository;
import com.fixly.service.UserService;

@Service
public class UserServiceImpl implements UserService{
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public void changePassword(String email, ChangePasswordRequest request) {
		
		User user = userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User With This Email Not Found !"));
		
		if(!passwordEncoder.matches(request.getOldPassword(), user.getPassword()))
		{
			throw new RuntimeException("Old Password is incorrect !");
		}
		
		if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New Password and confirm Password do not match !");
        }
		
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);
	}

}
