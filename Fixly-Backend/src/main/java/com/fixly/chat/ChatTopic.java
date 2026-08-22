package com.fixly.chat;

/**
 * What the user's message is ABOUT, independent of their role. Role is
 * combined with topic later (see resolveIntent inside ChatServiceImpl) to
 * decide which specific handler/response to use.
 */
public enum ChatTopic {
    EMERGENCY,

    GREETING,
    THANKS,
    GOODBYE,
    SMALL_TALK,
    FIXLY_INFO,

    SERVICE_SEARCH,

    BOOKING_CREATE,
    BOOKING_STATUS,
    BOOKING_ACCEPT_REJECT,
    BOOKING_CANCEL,
    BOOKING_RESCHEDULE,
    BOOKING_OTP,
    BOOKING_QUEUE,

    PAYMENT,
    RATING,
    ADDRESS,
    ACCOUNT,
    ACCOUNT_PASSWORD,
    NOTIFICATION,
    SUPPORT,

    PROVIDER_REGISTRATION,
    PROVIDER_VERIFICATION,
    PROVIDER_AVAILABILITY,
    PROVIDER_PROFILE,
    PROVIDER_SUSPENSION,

    UNKNOWN
}