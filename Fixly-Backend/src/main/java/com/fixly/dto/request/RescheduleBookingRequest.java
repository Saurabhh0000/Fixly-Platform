package com.fixly.dto.request;

import java.time.LocalDate;

import lombok.Data;

@Data
public class RescheduleBookingRequest {

    private LocalDate serviceDate;
}