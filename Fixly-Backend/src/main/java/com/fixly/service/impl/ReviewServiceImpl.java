package com.fixly.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fixly.dto.request.ReviewRequest;
import com.fixly.dto.response.ReviewResponse;
import com.fixly.entity.Booking;
import com.fixly.entity.Review;
import com.fixly.entity.ServiceProvider;
import com.fixly.enums.BookingStatus;
import com.fixly.exception.BadRequestException;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.BookingRepository;
import com.fixly.repository.ReviewRepository;
import com.fixly.repository.ServiceProviderRepository;
import com.fixly.service.ReviewService;

@Service
public class ReviewServiceImpl implements ReviewService{
	
	@Autowired
	private BookingRepository bookingRepositroy;
	
	@Autowired
	private ReviewRepository reviewReposiotry;
	
	@Autowired
    private ServiceProviderRepository providerRepo;


	@Override
	public ReviewResponse addReview(ReviewRequest request) {
		Booking booking = bookingRepositroy.findById(request.getBookingId()).orElseThrow(()-> new ResourceNotFoundException("Booking Not Found !"));
		
		if (!booking.getStatus().equals(BookingStatus.COMPLETED)) 
		{
            throw new BadRequestException("You can review only completed jobs");
        }
		if (reviewReposiotry.existsByBookingBookingId(booking.getBookingId())) {
            throw new BadRequestException("Review already submitted");
        }
		
		Review review = new Review();
        review.setBooking(booking);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewReposiotry.save(review);


        // ⭐ Update provider rating
        ServiceProvider provider = booking.getProvider();
        double newRating =
            (provider.getRating() + request.getRating()) / 2;

        provider.setRating(newRating);
        providerRepo.save(provider);

        ReviewResponse response = new ReviewResponse();
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCustomerName(booking.getUser().getFullName());
		return response;
	}

}
