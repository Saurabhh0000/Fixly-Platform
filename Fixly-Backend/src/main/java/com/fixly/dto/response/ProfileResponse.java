package com.fixly.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {

    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String profilePicture;
    private String role;
    private boolean active;

    private ProviderProfileData provider;

    @Data
    @Builder
    public static class ProviderProfileData {
        private Long providerId;
        private String category;
        private int experienceYears;
        private double pricePerVisit;
        private double rating;
        private boolean available;
        private String status;
    }
}
