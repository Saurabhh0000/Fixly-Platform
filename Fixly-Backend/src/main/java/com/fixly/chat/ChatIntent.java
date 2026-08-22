package com.fixly.chat;

/**
 * Role-aware label returned to the frontend in ChatResponse.intent.
 * Useful for analytics/debugging and for the lightweight follow-up
 * mechanism (ChatRequest.lastIntent).
 */
public enum ChatIntent {
    USER_SERVICE_SEARCH,
    USER_BOOKING_CREATE,
    USER_BOOKING_STATUS,
    USER_BOOKING_CANCEL,
    USER_BOOKING_RESCHEDULE,
    USER_BOOKING_OTP,
    USER_PAYMENT,
    USER_RATING,
    USER_ADDRESS,
    USER_ACCOUNT,
    USER_NOTIFICATION,
    USER_SUPPORT,

    PROVIDER_REGISTRATION,
    PROVIDER_VERIFICATION,
    PROVIDER_BOOKING,
    PROVIDER_AVAILABILITY,
    PROVIDER_PROFILE,
    PROVIDER_RATING,
    PROVIDER_SUSPENSION,
    PROVIDER_ACCOUNT,
    PROVIDER_SUPPORT,

    GENERAL_GREETING,
    GENERAL_THANKS,
    GENERAL_GOODBYE,
    GENERAL_SMALL_TALK,
    GENERAL_FIXLY_INFO,
    EMERGENCY,

    UNKNOWN
}