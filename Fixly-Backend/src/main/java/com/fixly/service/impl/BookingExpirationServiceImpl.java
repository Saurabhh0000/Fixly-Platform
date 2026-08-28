package com.fixly.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;

import com.fixly.entity.Booking;
import com.fixly.enums.BookingStatus;
import com.fixly.repository.BookingRepository;
import com.fixly.service.BookingExpirationService;
import com.fixly.util.FixlyClock;

@Service
public class BookingExpirationServiceImpl implements BookingExpirationService {

    private static final Logger log = LoggerFactory.getLogger(BookingExpirationServiceImpl.class);

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingExpirationTxHelper txHelper;

    @Override
    public void expireOverdueBookings() {

        List<Booking> overdue = bookingRepository.findExpiredBookings(
                FixlyClock.today(),
                List.of(BookingStatus.PENDING, BookingStatus.ACCEPTED));

        for (Booking booking : overdue) {
            try {
                txHelper.cancelSingleBooking(booking.getBookingId());
            } catch (OptimisticLockingFailureException e) {
                log.warn("Skipped booking #{} during expiry — concurrently modified.", booking.getBookingId());
            } catch (Exception e) {
                log.error("Failed to auto-cancel booking #{}", booking.getBookingId(), e);
            }
        }
    }
}