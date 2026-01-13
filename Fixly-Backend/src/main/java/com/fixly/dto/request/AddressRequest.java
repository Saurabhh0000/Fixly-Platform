package com.fixly.dto.request;

import lombok.Data;

@Data
public class AddressRequest {
	
	private String city;
	private String area;
	private String pincode;

}
