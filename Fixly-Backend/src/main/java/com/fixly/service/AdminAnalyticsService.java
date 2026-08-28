package com.fixly.service;

import java.util.List;

import com.fixly.dto.response.AdminOverviewResponse;
import com.fixly.dto.response.ProviderStatusBreakdownResponse;
import com.fixly.dto.response.BookingTrendPoint;
import com.fixly.dto.response.RevenueTrendPoint;
import com.fixly.dto.response.CategoryPerformanceResponse;
import com.fixly.dto.response.TopProviderResponse;
import com.fixly.dto.response.RecentActivityItem;

public interface AdminAnalyticsService {
    AdminOverviewResponse getOverview(String period);

    ProviderStatusBreakdownResponse getProviderAnalytics();

    List<BookingTrendPoint> getBookingTrends(String granularity);

    List<RevenueTrendPoint> getRevenueTrends(String granularity);

    List<CategoryPerformanceResponse> getCategoryPerformance(String period);

    List<TopProviderResponse> getTopProviders(int limit);

    List<RecentActivityItem> getRecentActivity(int limit);
}