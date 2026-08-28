package com.fixly.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.fixly.entity.Booking;
import com.fixly.enums.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

	List<Booking> findByProviderProviderId(Long providerId);

	List<Booking> findByUserUserId(Long userId);

	long countByStatus(BookingStatus status);

	List<Booking> findByServiceDateBetween(LocalDate start, LocalDate end);

	List<Booking> findTop10ByOrderByBookingIdDesc();

	@Query("""
			SELECT c.name,
			       COUNT(b),
			       SUM(CASE WHEN b.status = :completed THEN 1L ELSE 0L END),
			       COALESCE(SUM(CASE WHEN b.status = :completed THEN b.provider.pricePerVisit ELSE 0 END), 0)
			FROM Booking b
			JOIN b.provider p
			JOIN p.category c
			WHERE b.serviceDate BETWEEN :start AND :end
			GROUP BY c.serviceId, c.name
			""")
	List<Object[]> categoryPerformance(
			@Param("start") LocalDate start,
			@Param("end") LocalDate end,
			@Param("completed") BookingStatus completed);

	@Query("""
			SELECT p.providerId, u.fullName, c.name, p.rating,
			       COUNT(b),
			       SUM(CASE WHEN b.status = :completed THEN 1L ELSE 0L END),
			       COALESCE(SUM(CASE WHEN b.status = :completed THEN p.pricePerVisit ELSE 0 END), 0)
			FROM Booking b
			JOIN b.provider p
			JOIN p.user u
			JOIN p.category c
			GROUP BY p.providerId, u.fullName, c.name, p.rating
			ORDER BY SUM(CASE WHEN b.status = :completed THEN 1L ELSE 0L END) DESC
			""")
	List<Object[]> topProviders(@Param("completed") BookingStatus completed, Pageable pageable);

	@Query("""
			SELECT DISTINCT b FROM Booking b
			JOIN FETCH b.user u
			JOIN FETCH b.provider p
			JOIN FETCH p.user pu
			WHERE b.serviceDate < :date
			AND b.status IN :statuses
			""")
	List<Booking> findExpiredBookings(@Param("date") LocalDate date, @Param("statuses") List<BookingStatus> statuses);
}