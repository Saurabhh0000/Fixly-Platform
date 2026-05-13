package com.fixly.dto.response;

import lombok.Data;

@Data
public class ProviderStatusResponse {

    private Long providerId;

    private String status;

    private boolean available;
}