package com.fixly.dto.request;

import java.time.LocalDate;

import lombok.Data;

@Data
public class BookingRequest {
	
	private Long userId;
	private Long providerId;
	private Long addressId;
	private LocalDate serviceDate;
	

}
