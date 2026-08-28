package com.fixly.service.impl;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fixly.dto.response.AdminOverviewResponse;
import com.fixly.dto.response.ProviderStatusBreakdownResponse;
import com.fixly.dto.response.BookingTrendPoint;
import com.fixly.dto.response.RevenueTrendPoint;
import com.fixly.dto.response.CategoryPerformanceResponse;
import com.fixly.dto.response.TopProviderResponse;
import com.fixly.dto.response.RecentActivityItem;
import com.fixly.dto.response.AdminOverviewResponse;
import com.fixly.dto.response.ProviderStatusBreakdownResponse;
import com.fixly.dto.response.BookingTrendPoint;
import com.fixly.dto.response.RevenueTrendPoint;
import com.fixly.dto.response.CategoryPerformanceResponse;
import com.fixly.dto.response.TopProviderResponse;
import com.fixly.dto.response.ChartPoint;
import com.fixly.entity.Booking;
import com.fixly.entity.Notification;
import com.fixly.enums.BookingStatus;
import com.fixly.enums.ProviderStatus;
import com.fixly.enums.Role;
import com.fixly.repository.BookingRepository;
import com.fixly.repository.NotificationRepository;
import com.fixly.repository.ReviewRepository;
import com.fixly.repository.ServiceProviderRepository;
import com.fixly.repository.UserRepository;
import com.fixly.service.AdminAnalyticsService;

@Service
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    // Same convention already used elsewhere in the codebase
    // (ProviderServiceImpl notifies userId=1L for new applications).
    private static final Long ADMIN_USER_ID = 1L;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ServiceProviderRepository providerRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private NotificationRepository notificationRepository;

    /* ===================== OVERVIEW ===================== */

    @Override
    public AdminOverviewResponse getOverview(String period) {
        String p = normalizePeriod(period);
        LocalDate[] range = resolveOverviewRange(p);

        long totalUsers = userRepository.countByRole(Role.USER);
        long totalProviders = providerRepository.count();
        long approvedProviders = providerRepository.countByStatus(ProviderStatus.APPROVED);
        long pendingProviders = providerRepository.countByStatus(ProviderStatus.PENDING);
        Double avgRatingRaw = providerRepository.averageRating();

        List<Booking> periodBookings = bookingRepository.findByServiceDateBetween(range[0], range[1]);
        long totalBookings = periodBookings.size();
        long completed = periodBookings.stream().filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();
        long pending = periodBookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
        long accepted = periodBookings.stream().filter(b -> b.getStatus() == BookingStatus.ACCEPTED).count();
        long cancelled = periodBookings.stream().filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();

        double totalRevenue = periodBookings.stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b -> b.getProvider().getPricePerVisit())
                .sum();
        double avgBookingValue = completed > 0 ? totalRevenue / completed : 0;
        double completionRate = totalBookings > 0 ? (completed * 100.0) / totalBookings : 0;
        double cancellationRate = totalBookings > 0 ? (cancelled * 100.0) / totalBookings : 0;
        double approvalRate = totalProviders > 0 ? (approvedProviders * 100.0) / totalProviders : 0;
        double userToProviderRatio = approvedProviders > 0 ? (double) totalUsers / approvedProviders : 0;

        AdminOverviewResponse r = new AdminOverviewResponse();
        r.setPeriodLabel(p);
        r.setTotalUsers(totalUsers);
        r.setTotalProviders(totalProviders);
        r.setApprovedProviders(approvedProviders);
        r.setPendingProviders(pendingProviders);
        r.setAverageProviderRating(avgRatingRaw == null ? 0 : Math.round(avgRatingRaw * 100.0) / 100.0);
        r.setTotalBookings(totalBookings);
        r.setCompletedBookings(completed);
        r.setPendingBookings(pending);
        r.setAcceptedBookings(accepted);
        r.setCancelledBookings(cancelled);
        r.setTotalRevenue(totalRevenue);
        r.setAverageBookingValue(avgBookingValue);
        r.setBookingCompletionRate(round1(completionRate));
        r.setBookingCancellationRate(round1(cancellationRate));
        r.setProviderApprovalRate(round1(approvalRate));
        r.setUserToProviderRatio(Math.round(userToProviderRatio * 100.0) / 100.0);
        return r;
    }

    /* ===================== PROVIDERS ===================== */

    @Override
    public ProviderStatusBreakdownResponse getProviderAnalytics() {
        long pending = providerRepository.countByStatus(ProviderStatus.PENDING);
        long verifying = providerRepository.countByStatus(ProviderStatus.VERIFYING);
        long approved = providerRepository.countByStatus(ProviderStatus.APPROVED);
        long rejected = providerRepository.countByStatus(ProviderStatus.REJECTED);
        long suspended = providerRepository.countByStatus(ProviderStatus.SUSPENDED);

        ProviderStatusBreakdownResponse r = new ProviderStatusBreakdownResponse();
        r.setPending(pending);
        r.setVerifying(verifying);
        r.setApproved(approved);
        r.setRejected(rejected);
        r.setSuspended(suspended);
        r.setTotal(pending + verifying + approved + rejected + suspended);
        r.setChart(List.of(
                new ChartPoint("Approved", approved),
                new ChartPoint("Pending", pending),
                new ChartPoint("Verifying", verifying),
                new ChartPoint("Rejected", rejected),
                new ChartPoint("Suspended", suspended)));
        return r;
    }

    /* ===================== BOOKING TRENDS ===================== */

    @Override
    public List<BookingTrendPoint> getBookingTrends(String granularity) {
        String g = normalizeGranularity(granularity);
        LocalDate end = LocalDate.now();
        LocalDate start = rangeStart(end, g);

        List<Booking> bookings = bookingRepository.findByServiceDateBetween(start, end);
        List<String> labels = generateBucketLabels(start, end, g);

        Map<String, long[]> buckets = new LinkedHashMap<>();
        // [total, completed, pending, accepted, cancelled]
        labels.forEach(l -> buckets.put(l, new long[5]));

        for (Booking b : bookings) {
            String key = bucketKey(b.getServiceDate(), g);
            long[] arr = buckets.get(key);
            if (arr == null)
                continue;
            arr[0]++;
            switch (b.getStatus()) {
                case COMPLETED -> arr[1]++;
                case PENDING -> arr[2]++;
                case ACCEPTED -> arr[3]++;
                case CANCELLED -> arr[4]++;
            }
        }

        List<BookingTrendPoint> result = new ArrayList<>();
        buckets.forEach(
                (label, arr) -> result.add(new BookingTrendPoint(label, arr[0], arr[1], arr[2], arr[3], arr[4])));
        return result;
    }

    /* ===================== REVENUE TRENDS ===================== */

    @Override
    public List<RevenueTrendPoint> getRevenueTrends(String granularity) {
        String g = normalizeGranularity(granularity);
        LocalDate end = LocalDate.now();
        LocalDate start = rangeStart(end, g);

        List<Booking> completedBookings = bookingRepository.findByServiceDateBetween(start, end)
                .stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .toList();

        List<String> labels = generateBucketLabels(start, end, g);
        Map<String, double[]> buckets = new LinkedHashMap<>();
        // [revenue, count]
        labels.forEach(l -> buckets.put(l, new double[2]));

        for (Booking b : completedBookings) {
            String key = bucketKey(b.getServiceDate(), g);
            double[] arr = buckets.get(key);
            if (arr == null)
                continue;
            arr[0] += b.getProvider().getPricePerVisit();
            arr[1] += 1;
        }

        List<RevenueTrendPoint> result = new ArrayList<>();
        buckets.forEach((label, arr) -> result.add(new RevenueTrendPoint(label, arr[0], (long) arr[1])));
        return result;
    }

    /* ===================== CATEGORY PERFORMANCE ===================== */

    @Override
    public List<CategoryPerformanceResponse> getCategoryPerformance(String period) {
        LocalDate[] range = resolveOverviewRange(normalizePeriod(period));
        List<Object[]> rows = bookingRepository.categoryPerformance(range[0], range[1], BookingStatus.COMPLETED);

        long totalInPeriod = rows.stream().mapToLong(r -> (Long) r[1]).sum();

        return rows.stream()
                .map(r -> {
                    String name = (String) r[0];
                    long total = (Long) r[1];
                    long completed = (Long) r[2];
                    double revenue = ((Number) r[3]).doubleValue();
                    double pct = totalInPeriod > 0 ? round1((total * 100.0) / totalInPeriod) : 0;
                    return new CategoryPerformanceResponse(name, total, completed, revenue, pct);
                })
                .sorted((a, b) -> Long.compare(b.getTotalBookings(), a.getTotalBookings()))
                .toList();
    }

    /* ===================== TOP PROVIDERS ===================== */

    @Override
    public List<TopProviderResponse> getTopProviders(int limit) {
        Pageable pageable = PageRequest.of(0, Math.max(1, Math.min(limit, 50)));
        List<Object[]> rows = bookingRepository.topProviders(BookingStatus.COMPLETED, pageable);

        return rows.stream().map(r -> {
            Long providerId = (Long) r[0];
            String name = (String) r[1];
            String category = (String) r[2];
            Double rating = (Double) r[3];
            long total = (Long) r[4];
            long completed = (Long) r[5];
            double revenue = ((Number) r[6]).doubleValue();
            Long ratingCount = reviewRepository.countByBookingProviderProviderId(providerId);
            return new TopProviderResponse(
                    providerId, name, category, total, completed,
                    rating == null ? 0 : rating,
                    ratingCount == null ? 0 : ratingCount,
                    revenue);
        }).toList();
    }

    /* ===================== RECENT ACTIVITY ===================== */

    @Override
    public List<RecentActivityItem> getRecentActivity(int limit) {
        Pageable pageable = PageRequest.of(0, Math.max(1, Math.min(limit, 50)));
        List<Notification> notifications = notificationRepository.findByUserUserIdOrderByCreatedAtDesc(ADMIN_USER_ID,
                pageable);

        return notifications.stream()
                .map(n -> new RecentActivityItem(
                        n.getType() != null ? n.getType().name() : "GENERAL",
                        n.getTitle(),
                        n.getMessage(),
                        n.getCreatedAt(),
                        timeAgo(n.getCreatedAt())))
                .toList();
    }

    /* ===================== HELPERS ===================== */

    private String normalizePeriod(String period) {
        if (period == null)
            return "month";
        String p = period.toLowerCase();
        return switch (p) {
            case "today", "week", "year" -> p;
            default -> "month";
        };
    }

    private LocalDate[] resolveOverviewRange(String period) {
        LocalDate today = LocalDate.now();
        return switch (period) {
            case "today" -> new LocalDate[] { today, today };
            case "week" -> new LocalDate[] { today.minusDays(6), today };
            case "year" -> new LocalDate[] { today.withDayOfYear(1), today };
            default -> new LocalDate[] { today.withDayOfMonth(1), today }; // month
        };
    }

    private String normalizeGranularity(String granularity) {
        if (granularity == null)
            return "monthly";
        String g = granularity.toLowerCase();
        return switch (g) {
            case "daily", "weekly", "yearly" -> g;
            default -> "monthly";
        };
    }

    private LocalDate rangeStart(LocalDate end, String granularity) {
        return switch (granularity) {
            case "daily" -> end.minusDays(13);
            case "weekly" -> end.minusWeeks(7).with(DayOfWeek.MONDAY);
            case "yearly" -> end.minusYears(4).withDayOfYear(1);
            default -> end.minusMonths(11).withDayOfMonth(1); // monthly
        };
    }

    private List<String> generateBucketLabels(LocalDate start, LocalDate end, String granularity) {
        List<String> labels = new ArrayList<>();
        switch (granularity) {
            case "daily" -> {
                DateTimeFormatter f = DateTimeFormatter.ofPattern("dd MMM");
                for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1))
                    labels.add(d.format(f));
            }
            case "weekly" -> {
                DateTimeFormatter f = DateTimeFormatter.ofPattern("dd MMM");
                for (LocalDate d = start; !d.isAfter(end); d = d.plusWeeks(1))
                    labels.add("Wk " + d.format(f));
            }
            case "yearly" -> {
                for (int y = start.getYear(); y <= end.getYear(); y++)
                    labels.add(String.valueOf(y));
            }
            default -> {
                DateTimeFormatter f = DateTimeFormatter.ofPattern("MMM yyyy");
                LocalDate d = start.withDayOfMonth(1);
                while (!d.isAfter(end)) {
                    labels.add(d.format(f));
                    d = d.plusMonths(1);
                }
            }
        }
        return labels;
    }

    private String bucketKey(LocalDate date, String granularity) {
        return switch (granularity) {
            case "daily" -> date.format(DateTimeFormatter.ofPattern("dd MMM"));
            case "weekly" -> "Wk " + date.with(DayOfWeek.MONDAY).format(DateTimeFormatter.ofPattern("dd MMM"));
            case "yearly" -> String.valueOf(date.getYear());
            default -> date.format(DateTimeFormatter.ofPattern("MMM yyyy"));
        };
    }

    private double round1(double v) {
        return Math.round(v * 10.0) / 10.0;
    }

    private String timeAgo(OffsetDateTime time) {
        if (time == null)
            return "";
        Duration d = Duration.between(time, OffsetDateTime.now());
        long minutes = Math.max(0, d.toMinutes());
        if (minutes < 1)
            return "just now";
        if (minutes < 60)
            return minutes + " minute" + (minutes == 1 ? "" : "s") + " ago";
        long hours = d.toHours();
        if (hours < 24)
            return hours + " hour" + (hours == 1 ? "" : "s") + " ago";
        long days = d.toDays();
        return days + " day" + (days == 1 ? "" : "s") + " ago";
    }
}