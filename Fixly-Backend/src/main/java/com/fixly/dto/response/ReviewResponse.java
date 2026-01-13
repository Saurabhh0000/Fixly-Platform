package com.fixly.dto.response;

import lombok.Data;

@Data
public class ReviewResponse {
	private double rating;
    private String comment;
    private String customerName;

}
