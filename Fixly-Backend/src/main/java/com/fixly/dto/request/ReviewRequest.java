package com.fixly.dto.request;

import lombok.Data;

@Data
public class ReviewRequest {
	
	private Long bookingId;
    private double rating;      // 1–5
    private String comment;

}
