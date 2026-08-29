package com.fixly.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;
import org.springframework.data.domain.Pageable;

import com.fixly.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByBookingBookingId(Long bookingId);

    Long countByBookingProviderProviderId(Long providerId);

    // ── Chatbot support (ChatReviewContextService) ────────────────────

    Optional<Review> findTopByBookingUserUserIdOrderByBookingBookingIdDesc(Long userId);

    List<Review> findByBookingUserUserIdOrderByBookingBookingIdDesc(Long userId, Pageable pageable);

    Optional<Review> findTopByBookingProviderProviderIdOrderByBookingBookingIdDesc(Long providerId);

    List<Review> findByBookingProviderProviderIdOrderByBookingBookingIdDesc(Long providerId, Pageable pageable);
}
