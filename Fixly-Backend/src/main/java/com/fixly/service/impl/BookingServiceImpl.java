package com.fixly.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fixly.dto.request.BookingRequest;
import com.fixly.dto.response.BookingResponse;
import com.fixly.dto.response.ProviderBookingResponse;
import com.fixly.dto.response.UserBookingResponse;
import com.fixly.entity.Address;
import com.fixly.entity.Booking;
import com.fixly.entity.ServiceProvider;
import com.fixly.entity.User;
import com.fixly.enums.BookingStatus;
import com.fixly.exception.BadRequestException;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.AddressRepository;
import com.fixly.repository.BookingRepository;
import com.fixly.repository.ServiceProviderRepository;
import com.fixly.repository.UserRepository;
import com.fixly.service.BookingService;

@Service
public class BookingServiceImpl implements BookingService{
	
	@Autowired
	private BookingRepository bookingRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private ServiceProviderRepository providerRepository;
	
	@Autowired
	private AddressRepository addressRepository;

	
	// USER creates booking
	
	
	@Override
	public BookingResponse createBooking(BookingRequest request) {
		
		User user = userRepository.findById(request.getUserId()).orElseThrow(()-> new ResourceNotFoundException("User Not Found !"));
		
		ServiceProvider provider = providerRepository.findById(request.getProviderId()).orElseThrow(()-> new ResourceNotFoundException("Provider Not Found !"));
		
		Address address = addressRepository.findById(request.getAddressId()).orElseThrow(()-> new ResourceNotFoundException("Address Not Found !"));
		
		Booking booking = new Booking();
		
		booking.setUser(user);
		booking.setProvider(provider);
		booking.setAddress(address);
		booking.setServiceDate(request.getServiceDate());
		booking.setStatus(BookingStatus.PENDING);
		
		Booking save = bookingRepository.save(booking);
		
		return mapToResponse(save);
	}

	// PROVIDER accepts booking → OTP generated
	
	
	@Override
	public BookingResponse acceptBooking(Long bookingId) {
		Booking booking = bookingRepository.findById(bookingId).orElseThrow(()-> new ResourceNotFoundException("Booking Not Found !"));
		
		if(booking.getStatus() != BookingStatus.PENDING)
		{
			throw new BadRequestException("Booking cannot be accepted !");
		}
		
		booking.setStatus(BookingStatus.ACCEPTED);
		booking.setOtp(generateOtp());
		
		Booking saved = bookingRepository.save(booking);
		
		return mapToResponse(saved);
	}

	
	// OTP verification → COMPLETE
	
	
	@Override
	public BookingResponse completeBooking(Long bookingId, String otp) {
		Booking booking = bookingRepository.findById(bookingId).orElseThrow(()-> new ResourceNotFoundException("Booking Not Found !"));
		
		if(!booking.getOtp().equals(otp))
		{
			throw new BadRequestException("Inavaild OTP !");
		}
		
		booking.setStatus(BookingStatus.COMPLETED);
		booking.setOtp(null);
		
		Booking save = bookingRepository.save(booking);
		return mapToResponse(save);
	}
	
	@Override
	public BookingResponse cancelBooking(Long bookingId) {
		Booking booking = bookingRepository.findById(bookingId).orElseThrow(()-> new ResourceNotFoundException("Booking Not Found !"));
		
		if(booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELLED)
		{
			throw new BadRequestException("Booking Cannt Be Cancelled !");
		}
		
		booking.setStatus(BookingStatus.CANCELLED);
		booking.setOtp(null);
		
		Booking save = bookingRepository.save(booking);
		
		return mapToResponse(save);
	}
	
	@Override
	public List<ProviderBookingResponse> getProviderBookings(Long providerId) {
		List<Booking> byProviderId = bookingRepository.findByProviderProviderId(providerId);
		
		return byProviderId.stream().map(this::mapToProviderBookingResponse).collect(Collectors.toList());
	
	}
	
	@Override
	public List<UserBookingResponse> getUserBookings(Long userId) {

	    List<Booking> bookings =
	            bookingRepository.findByUserUserId(userId);

	    return bookings.stream()
	            .map(this::mapToUserBookingResponse)
	            .toList();
	}
	
	
	
	
	
	
	// mapToResponse and generate OTP Methods 
	
	private String generateOtp() {
        return UUID.randomUUID().toString().substring(0, 6);
    }
	
	private BookingResponse mapToResponse(Booking booking)
	{
		BookingResponse response = new BookingResponse();
		
		response.setBookingId(booking.getBookingId());
		response.setUserName(booking.getUser().getFullName());
        response.setProviderName(booking.getProvider().getUser().getFullName());
        response.setCategory(booking.getProvider().getCategory().getName());
        response.setServiceDate(booking.getServiceDate());
        response.setStatus(booking.getStatus().name());
        
        return response;
	}

	private ProviderBookingResponse mapToProviderBookingResponse(Booking booking) {

	    ProviderBookingResponse response = new ProviderBookingResponse();

	    response.setBookingId(booking.getBookingId());
	    response.setCustomerName(booking.getUser().getFullName());
	    response.setCustomerPhone(booking.getUser().getPhone());

	    response.setCity(booking.getAddress().getCity());
	    response.setArea(booking.getAddress().getArea());
	    response.setPincode(booking.getAddress().getPincode());

	    response.setServiceDate(booking.getServiceDate());
	    response.setPricePerVisit(booking.getProvider().getPricePerVisit());
	    response.setStatus(booking.getStatus().name());

	 // ✅ SAFE RATING HANDLING
	    if (booking.getReview() != null) {
	        response.setRating(booking.getReview().getRating());
	        response.setDescription(booking.getReview().getComment());

	    } else {
	        response.setRating(null); // or 0.0 if you prefer
	    }
	    return response;
	}

	
	private UserBookingResponse mapToUserBookingResponse(Booking booking) {

	    UserBookingResponse response = new UserBookingResponse();

	    response.setBookingId(booking.getBookingId());
	    response.setProviderName(booking.getProvider().getUser().getFullName());
	    response.setCategory(booking.getProvider().getCategory().getName());
	    response.setServiceDate(booking.getServiceDate());
	    response.setCity(booking.getAddress().getCity());
	    response.setArea(booking.getAddress().getArea());
	    response.setPincode(booking.getAddress().getPincode());
	    response.setStatus(booking.getStatus().name());
	    response.setPrice(booking.getProvider().getPricePerVisit());
	 // ✅ SEND OTP ONLY WHEN ACCEPTED
	    if (booking.getStatus() == BookingStatus.ACCEPTED) {
	        response.setOtp(booking.getOtp());
	    }
	 // ✅ REVIEW LOGIC
	    if (booking.getReview() != null) {
	        response.setReviewed(true);
	        response.setRating(booking.getReview().getRating());
	    } else {
	        response.setReviewed(false);
	    }

	    return response;
	}
	

}
