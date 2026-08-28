package com.fixly.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryPerformanceResponse {
    private String categoryName;
    private long totalBookings;
    private long completedBookings;
    private double revenue;
    private double percentageOfTotal;
}