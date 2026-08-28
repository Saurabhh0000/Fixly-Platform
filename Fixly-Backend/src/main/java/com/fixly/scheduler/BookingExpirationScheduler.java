package com.fixly.scheduler;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fixly.service.BookingExpirationService;

@Component
public class BookingExpirationScheduler {

    @Autowired
    private BookingExpirationService bookingExpirationService;

    // Runs at the top of every hour, Asia/Kolkata time. Frequent enough
    // that an overdue booking is caught within an hour of its service
    // date passing, without hammering the database. The job is
    // idempotent by construction — it only ever selects PENDING/ACCEPTED
    // bookings, so an already-CANCELLED booking is never touched twice.
    @Scheduled(cron = "0 0 * * * *", zone = "Asia/Kolkata")
    public void expireOverdueBookings() {
        bookingExpirationService.expireOverdueBookings();
    }
}