package com.fixly.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fixly.entity.Booking;
import com.fixly.enums.BookingStatus;
import com.fixly.enums.NotificationType;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.BookingRepository;
import com.fixly.service.NotificationService;
import com.fixly.util.FixlyClock;

/**
 * Runs each automatic booking cancellation in its own REQUIRES_NEW
 * transaction, so if one booking was concurrently modified (e.g. a
 * provider just accepted it, or the user just cancelled it manually)
 * only that one fails and gets skipped — it never rolls back the rest
 * of the scheduled batch.
 */
@Component
public class BookingExpirationTxHelper {

    private static final String SYSTEM_CANCELLATION_REASON = "Booking automatically cancelled because the scheduled service date has passed.";

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void cancelSingleBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking Not Found !"));

        // Re-check status inside this fresh transaction — it may have
        // changed since the batch list was fetched a moment ago.
        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.ACCEPTED) {
            return;
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setOtp(null);
        booking.setCancellationReason(SYSTEM_CANCELLATION_REASON);
        booking.setCancelledAt(FixlyClock.now());
        booking.setCancelledBy("SYSTEM");

        bookingRepository.save(booking);

        notificationService.send(
                booking.getUser().getUserId(),
                "Booking Cancelled",
                "Your booking #" + booking.getBookingId()
                        + " was automatically cancelled because the scheduled date passed.",
                NotificationType.BOOKING);

        notificationService.send(
                booking.getProvider().getUser().getUserId(),
                "Booking Cancelled",
                "Booking #" + booking.getBookingId()
                        + " was automatically cancelled because the scheduled date passed.",
                NotificationType.BOOKING);

        notificationService.send(
                1L,
                "Booking Auto-Cancelled",
                "Booking #" + booking.getBookingId()
                        + " was automatically cancelled — the scheduled service date passed.",
                NotificationType.BOOKING);
    }
}