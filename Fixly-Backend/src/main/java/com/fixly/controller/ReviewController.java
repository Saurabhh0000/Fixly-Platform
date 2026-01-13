package com.fixly.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fixly.dto.request.ReviewRequest;
import com.fixly.dto.response.ReviewResponse;
import com.fixly.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> submitReview(
            @RequestBody ReviewRequest request) {

        return ResponseEntity.ok(reviewService.addReview(request));
    }
}

