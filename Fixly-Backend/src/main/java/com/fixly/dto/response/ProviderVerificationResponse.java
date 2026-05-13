package com.fixly.dto.response;

import lombok.Data;

@Data
public class ProviderVerificationResponse {

    private Long providerId;

    private Long userId;

    private String fullName;

    private String email;

    private String phone;

    private String category;

    private int experienceYears;

    private double pricePerVisit;

    private String panCardNumber;

    private String aadhaarNumber;

    private String aadhaarFrontImage;

    private String aadhaarBackImage;

    private String status;
}
