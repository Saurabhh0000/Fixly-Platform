package com.fixly.dto.response;

import lombok.Data;

@Data
public class AdminOverviewResponse {
    private String periodLabel; // "today" | "week" | "month" | "year"

    // All-time (no createdAt available to filter these by period)
    private long totalUsers;
    private long totalProviders;
    private long approvedProviders;
    private long pendingProviders;
    private double averageProviderRating;

    // Scoped to the selected period, filtered by Booking.serviceDate
    private long totalBookings;
    private long completedBookings;
    private long pendingBookings;
    private long acceptedBookings;
    private long cancelledBookings;
    private double totalRevenue;
    private double averageBookingValue;
    private double bookingCompletionRate; // %
    private double bookingCancellationRate; // %

    // All-time
    private double providerApprovalRate; // %
    private double userToProviderRatio;
}