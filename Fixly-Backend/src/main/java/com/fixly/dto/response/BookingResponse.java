package com.fixly.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class BookingResponse {

    private Long bookingId;
    private String userName;
    private String providerName;
    private String category;
    private LocalDate serviceDate;
    private String status;

    private String cancellationReason;
    private LocalDateTime cancelledAt;
    private String cancelledBy;

}