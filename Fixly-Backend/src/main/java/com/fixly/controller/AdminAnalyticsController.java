package com.fixly.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fixly.dto.response.AdminOverviewResponse;
import com.fixly.dto.response.ProviderStatusBreakdownResponse;
import com.fixly.dto.response.BookingTrendPoint;
import com.fixly.dto.response.RevenueTrendPoint;
import com.fixly.dto.response.CategoryPerformanceResponse;
import com.fixly.dto.response.TopProviderResponse;
import com.fixly.dto.response.RecentActivityItem;
import com.fixly.service.AdminAnalyticsService;

@RestController
@RequestMapping("/api/admin/analytics")
@CrossOrigin
public class AdminAnalyticsController {

    @Autowired
    private AdminAnalyticsService analyticsService;

    @GetMapping("/overview")
    public ResponseEntity<AdminOverviewResponse> overview(@RequestParam(required = false) String period) {
        return ResponseEntity.ok(analyticsService.getOverview(period));
    }

    @GetMapping("/providers")
    public ResponseEntity<ProviderStatusBreakdownResponse> providers() {
        return ResponseEntity.ok(analyticsService.getProviderAnalytics());
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingTrendPoint>> bookings(@RequestParam(required = false) String granularity) {
        return ResponseEntity.ok(analyticsService.getBookingTrends(granularity));
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueTrendPoint>> revenue(@RequestParam(required = false) String granularity) {
        return ResponseEntity.ok(analyticsService.getRevenueTrends(granularity));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryPerformanceResponse>> categories(@RequestParam(required = false) String period) {
        return ResponseEntity.ok(analyticsService.getCategoryPerformance(period));
    }

    @GetMapping("/top-providers")
    public ResponseEntity<List<TopProviderResponse>> topProviders(@RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(analyticsService.getTopProviders(limit));
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<List<RecentActivityItem>> recentActivity(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(analyticsService.getRecentActivity(limit));
    }
}