package com.fixly.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fixly.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByBookingBookingId(Long bookingId);

    Long countByBookingProviderProviderId(Long providerId);
}

