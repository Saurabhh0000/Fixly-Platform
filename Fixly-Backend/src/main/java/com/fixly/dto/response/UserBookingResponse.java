package com.fixly.dto.response;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UserBookingResponse {
	private Long bookingId;
    private String providerName;
    private String category;
    private LocalDate serviceDate;
    private Double price;
    private String city;
    private String area;
    private String pincode;
    private String status;
    private String otp;
    private boolean reviewed;
    private Double rating; // optional, for stars display

}
