package com.fixly.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopProviderResponse {
    private Long providerId;
    private String fullName;
    private String category;
    private long totalBookings;
    private long completedBookings;
    private double rating;
    private long ratingCount;
    private double revenue;
}