package com.fixly.dto.response;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ProviderBookingResponse {
	
	private Long bookingId;
    private String customerName;
    private String customerPhone;
    private String city;
    private String area;
    private String pincode;
    private LocalDate serviceDate;
    private Double pricePerVisit;
    private String status;
    private Double rating;
    private String description;

}
