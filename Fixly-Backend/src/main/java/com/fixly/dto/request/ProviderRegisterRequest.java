package com.fixly.dto.request;

import lombok.Data;

@Data
public class ProviderRegisterRequest {
	
	private Long userId;
	private Long categoryId;
	private int experienceYears;
	private double pricePerVisit;

}
