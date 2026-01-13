package com.fixly.dto.response;

import lombok.Data;

@Data
public class ProviderResponse {
	
	private Long providerId;
    private Long userId;
    private String fullName;
    private String category;
    private int experienceYears;
    private double pricePerVisit;
    // ⭐ Rating Info
    private double rating;
    private long ratingCount;
    
    // 🟢 Availability
    private boolean available;
}
