package com.fixly.chat;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.fixly.entity.Review;
import com.fixly.repository.ReviewRepository;

/**
 * Read-only review lookups for the chatbot (Part 20).
 *
 * Review's own primary-key field name wasn't available to verify, so
 * "most recent" is ordered via booking.bookingId (a field we DO know
 * exists) rather than guessing reviewId/id. If Review has its own
 * createdAt, prefer ordering by that instead once confirmed.
 */
@Service
public class ChatReviewContextService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Optional<Review> getLatestReviewForUser(Long userId) {
        return reviewRepository.findTopByBookingUserUserIdOrderByBookingBookingIdDesc(userId);
    }

    public List<Review> getRecentReviewsForUser(Long userId, int limit) {
        return reviewRepository.findByBookingUserUserIdOrderByBookingBookingIdDesc(userId, PageRequest.of(0, limit));
    }

    public Optional<Review> getLatestReviewForProvider(Long providerId) {
        return reviewRepository.findTopByBookingProviderProviderIdOrderByBookingBookingIdDesc(providerId);
    }

    public List<Review> getRecentReviewsForProvider(Long providerId, int limit) {
        return reviewRepository.findByBookingProviderProviderIdOrderByBookingBookingIdDesc(providerId,
                PageRequest.of(0, limit));
    }
}