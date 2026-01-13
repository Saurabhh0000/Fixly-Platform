package com.fixly.dto.response;

import lombok.Data;

@Data
public class AddressResponse {
	
	private Long id;
	private String city;
	private String area;
	private String pincode;

}
