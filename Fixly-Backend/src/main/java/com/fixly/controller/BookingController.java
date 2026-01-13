package com.fixly.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fixly.dto.request.BookingRequest;
import com.fixly.dto.response.BookingResponse;
import com.fixly.dto.response.ProviderBookingResponse;
import com.fixly.dto.response.UserBookingResponse;
import com.fixly.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {
	
	@Autowired
	private BookingService bookingService;
	
    // USER

	@PostMapping
	public ResponseEntity<BookingResponse> create(@RequestBody BookingRequest request)
	{
		BookingResponse booking = bookingService.createBooking(request);
		
		return ResponseEntity.ok(booking);
	}
	
	// PROVIDER
	
    @PutMapping("/{bookingId}/accept")
	public ResponseEntity<BookingResponse> accept(@PathVariable Long bookingId)
	{
		BookingResponse acceptBooking = bookingService.acceptBooking(bookingId);
		
		return ResponseEntity.ok(acceptBooking);
	}
    
    // OTP verification

    @PutMapping("/{bookingId}/complete")
    public ResponseEntity<BookingResponse> complete(@PathVariable Long bookingId,@RequestParam String otp)
	{
		BookingResponse completeBooking = bookingService.completeBooking(bookingId,otp);
		
		return ResponseEntity.ok(completeBooking);
	}
    
    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancel(@PathVariable Long bookingId)
    {
    	BookingResponse cancelBooking = bookingService.cancelBooking(bookingId);
    	return ResponseEntity.ok(cancelBooking);
    }
    
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ProviderBookingResponse>> getProviderBookings(@PathVariable Long providerId) {

        return ResponseEntity.ok(bookingService.getProviderBookings(providerId));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserBookingResponse>> getUserBookings(@PathVariable Long userId) {

        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }
    @GetMapping("/provider/{providerId}/active")
    public ResponseEntity<ProviderBookingResponse> getActiveBooking(
            @PathVariable Long providerId) {

        ProviderBookingResponse booking =
                bookingService.getProviderBookings(providerId)
                              .stream()
                              .filter(b -> "ACCEPTED".equals(b.getStatus()))
                              .findFirst()
                              .orElse(null);

        return ResponseEntity.ok(booking);
    }


}
