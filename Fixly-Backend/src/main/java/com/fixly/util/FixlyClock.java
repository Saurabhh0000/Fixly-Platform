package com.fixly.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

// Centralized timezone strategy: Fixly operates in India, so every
// date/time comparison the booking lifecycle makes (expiry, cancellation
// timestamps) goes through here instead of scattering ZoneId.of(...)
// calls across services.
public final class FixlyClock {

    public static final ZoneId ZONE = ZoneId.of("Asia/Kolkata");

    private FixlyClock() {
    }

    public static LocalDate today() {
        return LocalDate.now(ZONE);
    }

    public static LocalDateTime now() {
        return LocalDateTime.now(ZONE);
    }
}