package com.fixly.service;

import java.util.List;

import com.fixly.dto.request.BookingRequest;
import com.fixly.dto.response.BookingResponse;
import com.fixly.dto.response.ProviderBookingResponse;
import com.fixly.dto.response.UserBookingResponse;

public interface BookingService {
	
	BookingResponse createBooking(BookingRequest request);
	BookingResponse acceptBooking(Long bookingId);
    BookingResponse completeBooking(Long bookingId, String otp);
    BookingResponse cancelBooking(Long bookingId);
    
    List<ProviderBookingResponse> getProviderBookings(Long providerId);
    List<UserBookingResponse> getUserBookings(Long userId);



}
