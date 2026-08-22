package com.fixly.chat;

import java.util.Comparator;
import java.util.List;
import java.util.Set;

import static com.fixly.chat.ChatTopic.*;

public final class ChatIntentRules {

        private ChatIntentRules() {
        }

        public static final List<ChatIntentRule> RULES = List.of(

                        new ChatIntentRule(EMERGENCY, 1000, Set.of(
                                        "fire", "gas leak", "gas smell", "spark", "sparks", "electric shock", "shock",
                                        "smoke", "explosion", "serious injury", "injured", "bleeding",
                                        "medical emergency", "violent")),

                        new ChatIntentRule(PROVIDER_VERIFICATION, 930, Set.of(
                                        "verifying", "why am i still verifying", "what does verifying mean",
                                        "how long does approval take", "verification", "application rejected",
                                        "what should i do after rejection", "documents required",
                                        "what documents are required", "aadhaar", "pan card")),

                        new ChatIntentRule(PROVIDER_REGISTRATION, 920, Set.of(
                                        "become a provider", "become provider", "register as a provider",
                                        "register as provider", "how do i become a provider", "join fixly",
                                        "provider application", "why is my provider application pending",
                                        "why hasnt admin approved me", "what happens after registration",
                                        "provider application rejected", "i want to offer services",
                                        "i want to work on fixly")),

                        new ChatIntentRule(PROVIDER_SUSPENSION, 910, Set.of(
                                        "account is suspended", "cannot login as provider", "cant login as provider",
                                        "get my account unsuspended", "provider account was suspended", "suspended",
                                        "account unsuspended")),

                        new ChatIntentRule(BOOKING_OTP, 890, Set.of(
                                        "otp", "where do i find the otp", "otp is not working", "otp not working",
                                        "forgot the otp", "forgot otp", "share otp", "customer hasnt provided otp",
                                        "how do i complete a service", "where do i enter otp", "verify the service")),

                        new ChatIntentRule(BOOKING_ACCEPT_REJECT, 880, Set.of(
                                        "how do i accept a booking", "how do i reject a booking", "accept booking",
                                        "reject booking", "accept a booking", "reject a booking",
                                        "why hasnt my provider accepted", "provider cancelled my booking",
                                        "my booking was rejected", "i received a booking request",
                                        "what happens after accepting")),

                        new ChatIntentRule(BOOKING_CANCEL, 870, Set.of(
                                        "cancel my booking", "cancel booking", "how to cancel", "cancellation",
                                        "can i cancel", "cancel service", "cancel appointment")),

                        new ChatIntentRule(BOOKING_RESCHEDULE, 865, Set.of(
                                        "reschedule", "change my booking date", "change booking date",
                                        "change my address after booking", "can i change my booking",
                                        "book a service at another address")),

                        new ChatIntentRule(BOOKING_QUEUE, 860, Set.of(
                                        "too many pending requests", "why did my booking disappear",
                                        "completed booking is not showing", "my completed booking")),

                        new ChatIntentRule(BOOKING_STATUS, 850, Set.of(
                                        "booking status", "my booking is still pending", "where is my booking",
                                        "track my booking", "what does pending mean", "what does accepted mean",
                                        "what does completed mean", "what happens after i place a booking",
                                        "what happens if provider doesnt arrive", "provider hasnt arrived",
                                        "provider arrived but", "my booking")),

                        new ChatIntentRule(BOOKING_CREATE, 840, Set.of(
                                        "how do i book", "book a service", "make a booking", "want to book",
                                        "can i book", "book a plumber", "book electrician", "schedule service",
                                        "how does booking work", "can someone come tomorrow", "book a service")),

                        new ChatIntentRule(PAYMENT, 820, Set.of(
                                        "payment", "pay", "paid", "payment failed", "money was deducted", "refund",
                                        "transaction", "payment error", "retry payment", "is my payment secure")),

                        new ChatIntentRule(PROVIDER_AVAILABILITY, 800, Set.of(
                                        "change my availability", "unavailable today",
                                        "stop receiving booking requests",
                                        "why am i not receiving bookings", "availability")),

                        new ChatIntentRule(PROVIDER_PROFILE, 790, Set.of(
                                        "update my provider profile", "change my service", "change my price",
                                        "update my experience", "update provider profile")),

                        new ChatIntentRule(RATING, 780, Set.of(
                                        "rating", "ratings", "review", "reviews", "how to rate", "rate a provider",
                                        "leave a review", "provider rating", "change my review", "feedback")),

                        new ChatIntentRule(ADDRESS, 770, Set.of(
                                        "address", "add an address", "wrong address", "multiple addresses",
                                        "city isnt available", "area isnt showing", "change my address",
                                        "moved to another city", "addresses")),

                        new ChatIntentRule(NOTIFICATION, 760, Set.of(
                                        "notification", "notifications", "unread notification", "mark as read",
                                        "why did i receive a notification")),

                        new ChatIntentRule(ACCOUNT_PASSWORD, 755, Set.of(
                                        "change password", "forgot my password", "forgot password", "reset password")),

                        new ChatIntentRule(ACCOUNT, 750, Set.of(
                                        "update my profile", "profile", "my account", "cant login", "cannot login",
                                        "account isnt working", "unauthorized", "logged out", "secure my account",
                                        "login", "account")),

                        new ChatIntentRule(SUPPORT, 740, Set.of(
                                        "i have a problem", "something isnt working", "i need help", "i cant book",
                                        "provider isnt responding", "booking is stuck", "received an error",
                                        "app isnt working", "contact support", "help", "issue", "complaint",
                                        "customer support")),

                        new ChatIntentRule(FIXLY_INFO, 700, Set.of(
                                        "what is fixly", "about fixly", "how does fixly work", "how fixly works",
                                        "tell me about fixly", "why fixly")),

                        new ChatIntentRule(SERVICE_SEARCH, 550, Set.of(
                                        "plumber", "plumbing", "pipe leak", "leaking tap", "leaking pipe",
                                        "electrician", "wiring", "fan is not working", "electricity problem",
                                        "cleaner", "clean my house", "cleaning", "child care", "childcare",
                                        "babysitter", "nanny", "appliance repair", "appliance", "washing machine",
                                        "fridge", "refrigerator", "ac repair", "ac not cooling", "air conditioner",
                                        "painter", "painting", "carpenter", "carpentry", "mechanic", "pest control",
                                        "pest problem", "salon", "gardening", "moving", "shifting",
                                        "which service should i choose", "i dont know which category",
                                        "what services does fixly provide", "find a plumber", "find an electrician",
                                        "need a plumber", "need electrician", "need cleaning", "need child care",
                                        "need ac repair", "need painter", "need carpenter", "what services")),

                        new ChatIntentRule(SMALL_TALK, 400, Set.of(
                                        "what can you do", "who are you", "are you a bot", "are you human",
                                        "how are you", "whats up")),

                        new ChatIntentRule(THANKS, 390, Set.of("thanks", "thank you", "thankyou", "thx")),

                        new ChatIntentRule(GOODBYE, 380, Set.of("bye", "goodbye", "see you", "talk later")),

                        new ChatIntentRule(GREETING, 300, Set.of(
                                        "hi", "hii", "hiii", "hello", "helo", "hey", "good morning",
                                        "good afternoon", "good evening", "namaste", "namaskar")));

        public static final List<ChatIntentRule> SORTED_RULES = RULES.stream()
                        .sorted(Comparator.comparingInt(ChatIntentRule::priority).reversed())
                        .toList();
}