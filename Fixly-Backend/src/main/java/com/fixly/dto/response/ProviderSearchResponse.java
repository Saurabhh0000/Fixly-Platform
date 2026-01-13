package com.fixly.dto.response;

import lombok.Data;

@Data
public class ProviderSearchResponse {
	
	private Long providerId;
	private String fullName;
	private String category;
	private int experienceYears;
	private double pricePerVisit;
	
	private double rating;
    private long ratingCount;

 // 🟢 Availability
    private boolean available;
	private String city;
	private String area;
	private String pincode;

}
