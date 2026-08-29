package com.fixly.chat;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.fixly.entity.Booking;
import com.fixly.enums.BookingStatus;
import com.fixly.repository.BookingRepository;

/**
 * Read-only query helper for the chatbot. Keeps ChatServiceImpl free of
 * repository/filtering logic (Part 18/19/31 of the chatbot spec).
 *
 * IMPORTANT: Booking has no confirmed createdAt column, so "latest
 * created" queries use bookingId DESC as a proxy (auto-increment IDs are
 * assigned in creation order). If you add a real createdAt timestamp
 * later, swap the ordering in BookingRepository accordingly.
 */
@Service
public class ChatBookingContextService {

    public static final ZoneId FIXLY_ZONE = ZoneId.of("Asia/Kolkata");

    private static final List<BookingStatus> ACTIVE_STATUSES = List.of(BookingStatus.PENDING, BookingStatus.ACCEPTED);

    @Autowired
    private BookingRepository bookingRepository;

    /* ===================== USER-SIDE ===================== */

    public Optional<Booking> getLatestBookingForUser(Long userId) {
        return bookingRepository.findTopByUserUserIdOrderByBookingIdDesc(userId);
    }

    /** Bookings the user could plausibly cancel right now (PENDING/ACCEPTED). */
    public List<Booking> getActiveBookingsForUser(Long userId) {
        return bookingRepository.findByUserUserIdAndStatusInOrderByServiceDateAsc(userId, ACTIVE_STATUSES);
    }

    /**
     * Bookings eligible for reschedule per the real business rule: CANCELLED only.
     */
    public List<Booking> getRescheduleEligibleBookingsForUser(Long userId) {
        return bookingRepository.findByUserUserIdAndStatusOrderByCancelledAtDesc(userId, BookingStatus.CANCELLED);
    }

    public List<Booking> getUpcomingBookingsForUser(Long userId) {
        LocalDate today = LocalDate.now(FIXLY_ZONE);
        return bookingRepository.findByUserUserIdAndStatusInAndServiceDateGreaterThanEqualOrderByServiceDateAsc(
                userId, ACTIVE_STATUSES, today);
    }

    public Optional<Booking> getRecentCancelledBookingForUser(Long userId) {
        return bookingRepository.findTopByUserUserIdAndStatusOrderByCancelledAtDesc(userId, BookingStatus.CANCELLED);
    }

    public Optional<Booking> getRecentCompletedBookingForUser(Long userId) {
        return bookingRepository.findTopByUserUserIdAndStatusOrderByBookingIdDesc(userId, BookingStatus.COMPLETED);
    }

    public List<Booking> getBookingsForUserOnDate(Long userId, LocalDate date) {
        return bookingRepository.findByUserUserIdAndServiceDate(userId, date);
    }

    /* ===================== PROVIDER-SIDE ===================== */

    public Optional<Booking> getLatestBookingForProvider(Long providerId) {
        return bookingRepository.findTopByProviderProviderIdOrderByBookingIdDesc(providerId);
    }

    public List<Booking> getPendingBookingsForProvider(Long providerId) {
        return bookingRepository.findByProviderProviderIdAndStatusOrderByServiceDateAsc(providerId,
                BookingStatus.PENDING);
    }

    /** Bookings a provider could plausibly cancel right now (PENDING/ACCEPTED). */
    public List<Booking> getActiveBookingsForProvider(Long providerId) {
        return bookingRepository.findByProviderProviderIdAndStatusInOrderByServiceDateAsc(providerId, ACTIVE_STATUSES);
    }

    public List<Booking> getUpcomingBookingsForProvider(Long providerId) {
        LocalDate today = LocalDate.now(FIXLY_ZONE);
        return bookingRepository.findByProviderProviderIdAndStatusInAndServiceDateGreaterThanEqualOrderByServiceDateAsc(
                providerId, ACTIVE_STATUSES, today);
    }

    public Optional<Booking> getRecentCancelledBookingForProvider(Long providerId) {
        return bookingRepository.findTopByProviderProviderIdAndStatusOrderByCancelledAtDesc(providerId,
                BookingStatus.CANCELLED);
    }

    public Optional<Booking> getRecentCompletedBookingForProvider(Long providerId) {
        return bookingRepository.findTopByProviderProviderIdAndStatusOrderByBookingIdDesc(providerId,
                BookingStatus.COMPLETED);
    }

    public List<Booking> getBookingsForProviderOnDate(Long providerId, LocalDate date) {
        return bookingRepository.findByProviderProviderIdAndServiceDate(providerId, date);
    }

    /** Small, bounded "recent N" helper — avoids findAll()+filter (Part 31). */
    public List<Booking> getRecentCompletedBookingsForProvider(Long providerId, int limit) {
        return bookingRepository.findByProviderProviderIdAndStatusOrderByBookingIdDesc(
                providerId, BookingStatus.COMPLETED, PageRequest.of(0, limit));
    }
}