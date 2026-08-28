package com.fixly.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueTrendPoint {
    private String period;
    private double revenue;
    private long completedBookings;
}