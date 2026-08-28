package com.fixly.service;

import java.util.List;

import com.fixly.dto.request.BookingRequest;
import com.fixly.dto.request.CancellationRequest;
import com.fixly.dto.request.RescheduleBookingRequest;
import com.fixly.dto.response.BookingResponse;
import com.fixly.dto.response.ProviderBookingResponse;
import com.fixly.dto.response.UserBookingResponse;
import com.fixly.entity.User;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request);

    BookingResponse acceptBooking(Long bookingId);

    BookingResponse completeBooking(Long bookingId, String otp);

    BookingResponse cancelBooking(Long bookingId, CancellationRequest request, User actingUser);

    BookingResponse rescheduleBooking(Long bookingId, RescheduleBookingRequest request, User actingUser);

    List<ProviderBookingResponse> getProviderBookings(Long providerId);

    List<UserBookingResponse> getUserBookings(Long userId);

}
