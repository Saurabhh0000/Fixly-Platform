package com.fixly.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fixly.dto.request.BookingRequest;
import com.fixly.dto.request.CancellationRequest;
import com.fixly.dto.request.RescheduleBookingRequest;
import com.fixly.dto.response.BookingResponse;
import com.fixly.dto.response.ProviderBookingResponse;
import com.fixly.dto.response.UserBookingResponse;
import com.fixly.entity.Address;
import com.fixly.entity.Booking;
import com.fixly.entity.ServiceProvider;
import com.fixly.entity.User;
import com.fixly.enums.BookingStatus;
import com.fixly.enums.NotificationType;
import com.fixly.exception.BadRequestException;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.AddressRepository;
import com.fixly.repository.BookingRepository;
import com.fixly.repository.ServiceProviderRepository;
import com.fixly.repository.UserRepository;
import com.fixly.service.BookingService;
import com.fixly.service.NotificationService;
import com.fixly.util.FixlyClock;

@Service
public class BookingServiceImpl implements BookingService {

	@Autowired
	private BookingRepository bookingRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ServiceProviderRepository providerRepository;

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private NotificationService notificationService;

	// USER creates booking

	@Override
	public BookingResponse createBooking(BookingRequest request) {

		User user = userRepository.findById(request.getUserId())
				.orElseThrow(() -> new ResourceNotFoundException("User Not Found !"));

		ServiceProvider provider = providerRepository.findById(request.getProviderId())
				.orElseThrow(() -> new ResourceNotFoundException("Provider Not Found !"));

		Address address = addressRepository.findById(request.getAddressId())
				.orElseThrow(() -> new ResourceNotFoundException("Address Not Found !"));

		Booking booking = new Booking();

		booking.setUser(user);
		booking.setProvider(provider);
		booking.setAddress(address);
		booking.setServiceDate(request.getServiceDate());
		booking.setStatus(BookingStatus.PENDING);

		Booking save = bookingRepository.save(booking);

		notificationService.send(
				provider.getUser().getUserId(),
				"New Booking",
				user.getFullName() + " booked your " +
						provider.getCategory().getName() + " service.",
				NotificationType.BOOKING);
		notificationService.send(
				1L,
				"New Booking Created",
				user.getFullName() + " booked a " + provider.getCategory().getName() + " service.",
				NotificationType.BOOKING);

		return mapToResponse(save);
	}

	// PROVIDER accepts booking → OTP generated

	@Override
	public BookingResponse acceptBooking(Long bookingId) {
		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking Not Found !"));

		if (booking.getStatus() != BookingStatus.PENDING) {
			throw new BadRequestException("Booking cannot be accepted !");
		}

		booking.setStatus(BookingStatus.ACCEPTED);
		booking.setOtp(generateOtp());

		Booking saved = safeSave(booking);

		notificationService.send(
				booking.getUser().getUserId(),
				"Booking Accepted",
				"Your booking has been accepted. Your service verification OTP is "
						+ booking.getOtp()
						+ ". Please share it only after the service is completed.",
				NotificationType.BOOKING);

		return mapToResponse(saved);
	}

	// OTP verification → COMPLETE

	@Override
	public BookingResponse completeBooking(Long bookingId, String otp) {
		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking Not Found !"));

		if (!booking.getOtp().equals(otp)) {
			throw new BadRequestException("Inavaild OTP !");
		}

		booking.setStatus(BookingStatus.COMPLETED);
		booking.setOtp(null);

		Booking save = safeSave(booking);

		notificationService.send(
				booking.getUser().getUserId(),
				"Service Completed",
				"Your service has been completed successfully.",
				NotificationType.COMPLETED);

		notificationService.send(
				booking.getProvider().getUser().getUserId(),
				"Job Completed",
				"The booking has been marked as completed.",
				NotificationType.COMPLETED);
		notificationService.send(
				1L,
				"Booking Completed",
				"Booking #" + booking.getBookingId() + " was marked completed.",
				NotificationType.COMPLETED);

		return mapToResponse(save);
	}

	// USER / PROVIDER / ADMIN cancels booking with a required reason

	@Override
	@Transactional
	public BookingResponse cancelBooking(Long bookingId, CancellationRequest request, User actingUser) {

		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking Not Found !"));

		authorizeCancellation(booking, actingUser);

		if (booking.getStatus() == BookingStatus.COMPLETED) {
			throw new BadRequestException("Completed bookings cannot be cancelled.");
		}
		if (booking.getStatus() == BookingStatus.CANCELLED) {
			throw new BadRequestException("Booking is already cancelled.");
		}

		String cancelledByLabel = resolveCancelledByLabel(actingUser, booking);

		booking.setStatus(BookingStatus.CANCELLED);
		booking.setOtp(null);
		booking.setCancellationReason(request.getReason());
		booking.setCancelledAt(FixlyClock.now());
		booking.setCancelledBy(cancelledByLabel);

		Booking saved = safeSave(booking);

		notificationService.send(
				booking.getUser().getUserId(),
				"Booking Cancelled",
				"Your booking for " + booking.getProvider().getCategory().getName()
						+ " has been cancelled successfully.",
				NotificationType.BOOKING);

		notificationService.send(
				booking.getProvider().getUser().getUserId(),
				"Booking Cancelled",
				booking.getUser().getFullName() + " cancelled the booking for "
						+ booking.getProvider().getCategory().getName()
						+ ". Reason: " + request.getReason(),
				NotificationType.BOOKING);

		notificationService.send(
				1L,
				"Booking Cancelled",
				"Booking #" + booking.getBookingId() + " was cancelled by " + cancelledByLabel + ".",
				NotificationType.BOOKING);

		return mapToResponse(saved);
	}

	// USER reschedules a CANCELLED booking → back to PENDING

	@Override
	@Transactional
	public BookingResponse rescheduleBooking(Long bookingId, RescheduleBookingRequest request, User actingUser) {

		Booking booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new ResourceNotFoundException("Booking Not Found !"));

		if (!booking.getUser().getUserId().equals(actingUser.getUserId())) {
			throw new AccessDeniedException("You are not authorized to modify this booking.");
		}

		if (booking.getStatus() != BookingStatus.CANCELLED) {
			throw new BadRequestException("Only cancelled bookings can be rescheduled.");
		}

		booking.setServiceDate(request.getServiceDate());
		booking.setStatus(BookingStatus.PENDING);
		booking.setOtp(null);
		booking.setCancellationReason(null);
		booking.setCancelledAt(null);
		booking.setCancelledBy(null);

		Booking saved = safeSave(booking);

		notificationService.send(
				booking.getUser().getUserId(),
				"Booking Rescheduled",
				"Booking #" + booking.getBookingId()
						+ " has been rescheduled successfully and is waiting for provider confirmation.",
				NotificationType.BOOKING);

		notificationService.send(
				booking.getProvider().getUser().getUserId(),
				"Booking Rescheduled",
				booking.getUser().getFullName() + " rescheduled booking #" + booking.getBookingId()
						+ " to " + booking.getServiceDate() + ". Please review the request.",
				NotificationType.BOOKING);

		notificationService.send(
				1L,
				"Booking Rescheduled",
				"Booking #" + booking.getBookingId() + " was rescheduled by the customer.",
				NotificationType.BOOKING);

		return mapToResponse(saved);
	}

	@Override
	public List<ProviderBookingResponse> getProviderBookings(Long providerId) {
		List<Booking> byProviderId = bookingRepository.findByProviderProviderId(providerId);

		return byProviderId.stream().map(this::mapToProviderBookingResponse).collect(Collectors.toList());

	}

	@Override
	public List<UserBookingResponse> getUserBookings(Long userId) {

		List<Booking> bookings = bookingRepository.findByUserUserId(userId);

		return bookings.stream()
				.map(this::mapToUserBookingResponse)
				.toList();
	}

	/* ===================== AUTHORIZATION HELPERS ===================== */

	private void authorizeCancellation(Booking booking, User actingUser) {
		switch (actingUser.getRole()) {
			case ADMIN -> {
				// admins may cancel any booking
			}
			case USER -> {
				if (!booking.getUser().getUserId().equals(actingUser.getUserId())) {
					throw new AccessDeniedException("You are not authorized to modify this booking.");
				}
			}
			case PROVIDER -> {
				ServiceProvider provider = providerRepository.findByUser_UserId(actingUser.getUserId())
						.orElseThrow(() -> new AccessDeniedException(
								"You are not authorized to modify this booking."));
				if (!booking.getProvider().getProviderId().equals(provider.getProviderId())) {
					throw new AccessDeniedException("You are not authorized to modify this booking.");
				}
			}
			default -> throw new AccessDeniedException("You are not authorized to modify this booking.");
		}
	}

	private String resolveCancelledByLabel(User actingUser, Booking booking) {
		return switch (actingUser.getRole()) {
			case ADMIN -> "Admin";
			case PROVIDER -> booking.getProvider().getUser().getFullName() + " (Provider)";
			default -> actingUser.getFullName();
		};
	}

	/* ===================== CONCURRENCY-SAFE SAVE ===================== */

	private Booking safeSave(Booking booking) {
		try {
			return bookingRepository.save(booking);
		} catch (ObjectOptimisticLockingFailureException e) {
			throw new BadRequestException(
					"This booking was just updated elsewhere. Please refresh and try again.");
		}
	}

	// mapToResponse and generate OTP Methods

	private String generateOtp() {
		return UUID.randomUUID().toString().substring(0, 6);
	}

	private BookingResponse mapToResponse(Booking booking) {
		BookingResponse response = new BookingResponse();

		response.setBookingId(booking.getBookingId());
		response.setUserName(booking.getUser().getFullName());
		response.setProviderName(booking.getProvider().getUser().getFullName());
		response.setCategory(booking.getProvider().getCategory().getName());
		response.setServiceDate(booking.getServiceDate());
		response.setStatus(booking.getStatus().name());
		response.setCancellationReason(booking.getCancellationReason());
		response.setCancelledAt(booking.getCancelledAt());
		response.setCancelledBy(booking.getCancelledBy());

		return response;
	}

	private ProviderBookingResponse mapToProviderBookingResponse(Booking booking) {

		ProviderBookingResponse response = new ProviderBookingResponse();

		response.setBookingId(booking.getBookingId());
		response.setCustomerName(booking.getUser().getFullName());
		if (booking.getStatus().name().equals("ACCEPTED")
				||
				booking.getStatus().name().equals("COMPLETED")) {

			response.setCustomerPhone(
					booking.getUser()
							.getPhone());
		}
		response.setCity(booking.getAddress().getCity());
		response.setArea(booking.getAddress().getArea());
		response.setPincode(booking.getAddress().getPincode());

		response.setServiceDate(booking.getServiceDate());
		response.setPricePerVisit(booking.getProvider().getPricePerVisit());
		response.setStatus(booking.getStatus().name());
		response.setCancellationReason(booking.getCancellationReason());
		response.setCancelledAt(booking.getCancelledAt());
		response.setCancelledBy(booking.getCancelledBy());

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
		if (booking.getStatus().name().equals("ACCEPTED")
				||
				booking.getStatus().name().equals("COMPLETED")) {

			response.setProviderPhone(
					booking.getProvider()
							.getUser()
							.getPhone());
		}
		response.setServiceDate(booking.getServiceDate());
		response.setCity(booking.getAddress().getCity());
		response.setArea(booking.getAddress().getArea());
		response.setPincode(booking.getAddress().getPincode());
		response.setStatus(booking.getStatus().name());
		response.setPrice(booking.getProvider().getPricePerVisit());
		response.setCancellationReason(booking.getCancellationReason());
		response.setCancelledAt(booking.getCancelledAt());
		response.setCancelledBy(booking.getCancelledBy());
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