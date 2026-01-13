package com.fixly.dto.request;

import com.fixly.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
	private String fullName;
    private String email;
    private String phone;
    private String password;
    
    // Address fields (initial address)

    private String city;
    private String area;
    private String pincode;
    
    private Role role;

}
