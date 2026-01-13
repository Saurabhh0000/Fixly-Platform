package com.fixly.service;

import com.fixly.dto.request.ReviewRequest;
import com.fixly.dto.response.ReviewResponse;

public interface ReviewService {
	
	public ReviewResponse addReview(ReviewRequest request);

}
