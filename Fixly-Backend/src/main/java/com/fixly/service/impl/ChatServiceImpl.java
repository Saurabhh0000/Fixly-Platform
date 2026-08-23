package com.fixly.service.impl;

import java.util.List;
import java.util.Locale;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fixly.chat.AuthenticatedUserResolver;
import com.fixly.chat.ChatIntent;
import com.fixly.chat.ChatIntentDetector;
import com.fixly.chat.ChatRoutes;
import com.fixly.chat.ChatTopic;
import com.fixly.chat.ServiceCategoryMatcher;
import com.fixly.chat.ChatTextUtils;
import com.fixly.dto.request.ChatRequest;
import com.fixly.dto.response.ChatAction;
import com.fixly.dto.response.ChatResponse;
import com.fixly.entity.Booking;
import com.fixly.entity.ServiceCategory;
import com.fixly.entity.ServiceProvider;
import com.fixly.entity.User;
import com.fixly.enums.BookingStatus;
import com.fixly.enums.ProviderStatus;
import com.fixly.enums.Role;
import com.fixly.exception.BadRequestException;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.AddressRepository;
import com.fixly.repository.BookingRepository;
import com.fixly.repository.ReviewRepository;
import com.fixly.repository.ServiceProviderRepository;
import com.fixly.service.ChatService;
import com.fixly.service.NotificationService;

@Service
public class ChatServiceImpl implements ChatService {

        private static final Logger log = LoggerFactory.getLogger(ChatServiceImpl.class);

        @Autowired
        private AuthenticatedUserResolver userResolver;

        @Autowired
        private ChatIntentDetector intentDetector;

        @Autowired
        private ServiceCategoryMatcher categoryMatcher;

        @Autowired
        private BookingRepository bookingRepository;

        @Autowired
        private ServiceProviderRepository providerRepository;

        @Autowired
        private ReviewRepository reviewRepository;

        @Autowired
        private AddressRepository addressRepository;

        @Autowired
        private NotificationService notificationService;

        @Override
        public ChatResponse handleMessage(ChatRequest request) {

                String message = request.getMessage();
                if (message == null || message.trim().isEmpty()) {
                        throw new BadRequestException("Message cannot be empty");
                }

                // Guests are allowed here — /api/chat is public. This never throws;
                // it simply returns null when there's no authenticated user, and
                // every handler below is written to handle that null gracefully.
                User user = userResolver.resolveCurrentUserOrNull();
                Role role = user != null ? user.getRole() : null;

                ChatTopic topic = intentDetector.detectTopic(message, request.getLastIntent());
                String normalized = ChatTextUtils.normalize(message);

                try {
                        ChatResponse response = dispatch(topic, role, user, normalized);
                        return response.withIntent(resolveIntent(topic, role).name());
                } catch (BadRequestException | ResourceNotFoundException e) {
                        throw e;
                } catch (Exception e) {
                        // A failed data lookup should degrade gracefully, not break the chat.
                        log.error("Chat handler failed for topic={} userId={}",
                                        topic, user != null ? user.getUserId() : "guest", e);
                        return ChatResponse.of(
                                        "I'm sorry, I'm having trouble processing that right now. Please try again or use Help & Support.")
                                        .withIntent("ERROR")
                                        .withFollowUp(false);
                }
        }

        private ChatResponse dispatch(ChatTopic topic, Role role, User user, String normalized) {
                return switch (topic) {
                        case EMERGENCY -> emergency();
                        case GREETING -> greeting(role);
                        case THANKS -> ChatResponse.of(
                                        "You're very welcome! 😊 Let me know if there's anything else I can help with.");
                        case GOODBYE -> ChatResponse.of("Take care! 👋 I'm here whenever you need Fixly again.");
                        case SMALL_TALK -> smallTalk(role);
                        case FIXLY_INFO -> fixlyInfo();
                        case SERVICE_SEARCH -> serviceSearch(normalized);
                        case BOOKING_CREATE -> bookingCreate(role);
                        case BOOKING_STATUS -> bookingStatus(role, user, normalized);
                        case BOOKING_ACCEPT_REJECT -> bookingAcceptReject(role, user);
                        case BOOKING_CANCEL -> bookingCancel(role, user);
                        case BOOKING_RESCHEDULE -> bookingReschedule();
                        case BOOKING_OTP -> bookingOtp(role, user);
                        case BOOKING_QUEUE -> bookingQueue(role, user);
                        case PAYMENT -> payment();
                        case RATING -> rating(role, user);
                        case ADDRESS -> address(user);
                        case ACCOUNT -> account(role, user);
                        case ACCOUNT_PASSWORD -> accountPassword(user);
                        case NOTIFICATION -> notification(user);
                        case SUPPORT -> support(role);
                        case PROVIDER_REGISTRATION -> providerRegistration(role);
                        case PROVIDER_VERIFICATION -> providerVerification(user);
                        case PROVIDER_AVAILABILITY -> providerAvailability(role, user);
                        case PROVIDER_PROFILE -> providerProfile(role, user);
                        case PROVIDER_SUSPENSION -> providerSuspension(role, user);
                        default -> fallback(role);
                };
        }

        /**
         * Consistent "please log in" response for topics with no meaningful
         * public-facing content (personal notifications, account settings).
         */
        private ChatResponse loginRequired(String whatTheyNeedToDo) {
                return ChatResponse.of(
                                "You'll need to be logged in to " + whatTheyNeedToDo + ". Please log in to your Fixly "
                                                + "account and ask me again.",
                                new ChatAction("Log In", ChatRoutes.LOGIN))
                                .withFollowUp(false);
        }

        /* ===================== GREETING / SMALL TALK / INFO ===================== */

        private ChatResponse greeting(Role role) {
                if (role == Role.PROVIDER) {
                        return ChatResponse.of(
                                        "Hi! 👋 Welcome back to your Fixly Provider Dashboard. I can help you with booking "
                                                        + "requests, verification status, availability, your profile, and ratings. "
                                                        + "What do you need?");
                }
                if (role == Role.USER) {
                        return ChatResponse.of(
                                        "Hi! 👋 Welcome back to Fixly. I can help you with bookings, finding services, "
                                                        + "addresses, reviews, and more. What can I help you with today?");
                }
                return ChatResponse.of(
                                "Hi! 👋 Welcome to Fixly. I can help you find services, understand how bookings work, "
                                                + "or explain how to become a provider. What can I help you with today?",
                                new ChatAction("Browse Services", ChatRoutes.SEARCH));
        }

        private ChatResponse smallTalk(Role role) {
                String base = "I'm the Fixly Assistant 🤖 — not a person.";
                if (role == Role.PROVIDER) {
                        base += " I'm connected to your Fixly account, so I can help with booking requests, "
                                        + "verification, availability, and your provider profile.";
                } else if (role == Role.USER) {
                        base += " I'm connected to your Fixly account, so I can give account-specific answers "
                                        + "about your bookings, finding services, and more.";
                } else {
                        base += " I can answer general questions about Fixly, help you find a service, or explain "
                                        + "how bookings and provider registration work. Log in for account-specific answers.";
                }
                return ChatResponse.of(base);
        }

        private ChatResponse fixlyInfo() {
                return ChatResponse.of(
                                "Fixly is a service marketplace that connects customers with service professionals for "
                                                + "home and personal services. Customers browse categories, choose a provider, and "
                                                + "submit a booking request. The provider then accepts the request, performs the "
                                                + "service, and the booking is marked complete using an OTP-based verification step. "
                                                + "Providers join Fixly through an application and identity verification process "
                                                + "before they can start accepting bookings, which is designed to help customers "
                                                + "book with more confidence.",
                                new ChatAction("Browse Services", ChatRoutes.SEARCH));
        }

        private ChatResponse emergency() {
                return ChatResponse.of(
                                "This sounds like it could be an emergency. Please prioritize safety first — move away "
                                                + "from danger if needed and contact your local emergency services right away. "
                                                + "Fixly isn't set up to handle urgent emergencies, so please don't wait on a "
                                                + "booking for a situation like this.");
        }

        /* ===================== SERVICE SEARCH ===================== */

        private ChatResponse serviceSearch(String normalized) {
                Optional<ServiceCategory> match = categoryMatcher.matchCategory(normalized);

                if (match.isPresent()) {
                        ServiceCategory category = match.get();
                        String text = "That sounds like a " + category.getName().toLowerCase(Locale.ROOT)
                                        + " issue, so the " + category.getName()
                                        + " category would be the best place to "
                                        + "start. You can browse available professionals there and compare their experience, "
                                        + "pricing, and rating before choosing one.";
                        return ChatResponse.of(text,
                                        new ChatAction("Find " + category.getName(),
                                                        ChatRoutes.SEARCH + "?service="
                                                                        + category.getName().toLowerCase(Locale.ROOT)));
                }

                return ChatResponse.of(
                                "I couldn't match that to a specific category currently listed on Fixly, but you can "
                                                + "browse all available services and filter by category to find the right professional. "
                                                + "Could you tell me a bit more about what you need help with?",
                                new ChatAction("Browse Services", ChatRoutes.SEARCH))
                                .withFollowUp(true);
        }

        /* ===================== BOOKING ===================== */

        private ChatResponse bookingCreate(Role role) {
                if (role == Role.PROVIDER) {
                        return ChatResponse.of(
                                        "As a provider, you don't create bookings — customers submit booking requests to you, "
                                                        + "and you accept or manage them from your Provider Dashboard. If you're asking on "
                                                        + "behalf of a customer, they can book a service by browsing a category and "
                                                        + "selecting a provider.");
                }
                return ChatResponse.of(
                                "Booking a service on Fixly works like this:\n\n"
                                                + "1. Choose a service category\n"
                                                + "2. Browse providers and pick one based on experience, price, and rating\n"
                                                + "3. Select the address and service date\n"
                                                + "4. Confirm the booking request\n"
                                                + "5. The provider reviews it and can accept it\n"
                                                + "6. Once accepted, an OTP is generated — share it with the provider only after "
                                                + "the service is actually completed, as that's what marks the job done\n\n"
                                                + "Log in and you can track a real booking's status here directly.",
                                new ChatAction("Browse Services", ChatRoutes.SEARCH));
        }

        private ChatResponse bookingStatus(Role role, User user, String normalized) {
                if (normalized.contains("mean")) {
                        String meaning = explainStatusMeaning(normalized);
                        if (meaning != null)
                                return ChatResponse.of(meaning);
                }

                if (user == null) {
                        return loginRequired("check the status of your own booking");
                }

                if (role == Role.PROVIDER) {
                        ServiceProvider provider = providerRepository.findByUser_UserId(user.getUserId()).orElse(null);
                        if (provider == null) {
                                return ChatResponse.of(
                                                "I don't see an active provider profile on your account yet, so there's no "
                                                                + "booking activity to report.",
                                                new ChatAction("Become a Provider", ChatRoutes.BECOME_PROVIDER));
                        }
                        List<Booking> bookings = bookingRepository.findByProviderProviderId(provider.getProviderId());
                        return ChatResponse.of(summarizeProviderBookings(bookings),
                                        new ChatAction("Provider Dashboard", ChatRoutes.PROVIDER_DASHBOARD));
                }

                List<Booking> bookings = bookingRepository.findByUserUserId(user.getUserId());
                if (bookings.isEmpty()) {
                        return ChatResponse.of(
                                        "You don't have any bookings yet. Once you book a service, I'll be able to walk you "
                                                        + "through its status here.",
                                        new ChatAction("Browse Services", ChatRoutes.SEARCH));
                }

                Booking latest = bookings.get(bookings.size() - 1);
                String statusExplain = statusMeaning(latest.getStatus());
                return ChatResponse.of(
                                "Your most recent booking (with "
                                                + safe(latest.getProvider() != null
                                                                && latest.getProvider().getUser() != null
                                                                                ? latest.getProvider().getUser()
                                                                                                .getFullName()
                                                                                : "your provider")
                                                + ") is currently " + latest.getStatus().name() + ". " + statusExplain
                                                + " You can see full details and any earlier bookings in My Bookings.",
                                new ChatAction("View My Bookings", ChatRoutes.MY_BOOKINGS));
        }

        private String explainStatusMeaning(String normalized) {
                if (normalized.contains("pending")) {
                        return "PENDING means your booking request has been sent to the provider but they haven't "
                                        + "responded yet. Once they accept it, the status will change to ACCEPTED.";
                }
                if (normalized.contains("accepted")) {
                        return "ACCEPTED means the provider has agreed to take the job. An OTP is generated at this "
                                        + "point — you'll share it with the provider only after the service is actually done, "
                                        + "which is what marks the booking COMPLETED.";
                }
                if (normalized.contains("completed")) {
                        return "COMPLETED means the OTP was verified and the service has been marked as finished. "
                                        + "You can leave a review for a completed booking.";
                }
                if (normalized.contains("cancelled") || normalized.contains("rejected")) {
                        return "Fixly's booking states are Pending, Accepted, Completed, and Cancelled — there isn't "
                                        + "a separate 'Rejected' state. If a booking didn't go ahead, it will show as "
                                        + "CANCELLED, whether it was cancelled by you or the provider.";
                }
                return null;
        }

        private String statusMeaning(BookingStatus status) {
                return switch (status) {
                        case PENDING -> "That means the provider hasn't responded to your request yet.";
                        case ACCEPTED ->
                                "That means the provider has accepted — an OTP is available on this booking to share once the service is actually finished.";
                        case COMPLETED -> "That means the service has been marked finished and verified.";
                        case CANCELLED -> "That means the booking didn't go ahead.";
                };
        }

        private String summarizeProviderBookings(List<Booking> bookings) {
                if (bookings.isEmpty()) {
                        return "You don't have any booking requests yet.";
                }
                long pending = bookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
                long accepted = bookings.stream().filter(b -> b.getStatus() == BookingStatus.ACCEPTED).count();
                long completed = bookings.stream().filter(b -> b.getStatus() == BookingStatus.COMPLETED).count();
                long cancelled = bookings.stream().filter(b -> b.getStatus() == BookingStatus.CANCELLED).count();

                return "Here's your current booking activity: " + pending + " pending, " + accepted
                                + " accepted, " + completed + " completed, and " + cancelled + " cancelled. "
                                + "Pending requests are waiting on you to accept them from your Provider Dashboard.";
        }

        private ChatResponse bookingAcceptReject(Role role, User user) {
                if (role == Role.PROVIDER) {
                        return ChatResponse.of(
                                        "You can review incoming booking requests from your Provider Dashboard. Open a "
                                                        + "pending request to check the customer's service details, address, and "
                                                        + "scheduled date, then use Accept to take the job — this generates an OTP that "
                                                        + "the customer will share with you once the service is done. Right now Fixly's "
                                                        + "flow supports accepting or cancelling a request; I don't see a separate "
                                                        + "'reject' action beyond that.",
                                        new ChatAction("Provider Dashboard", ChatRoutes.PROVIDER_DASHBOARD));
                }
                if (user == null) {
                        return ChatResponse.of(
                                        "After a booking is submitted, the provider reviews it and can accept it — customers "
                                                        + "don't accept requests themselves. Log in to check the status of your own "
                                                        + "booking requests.",
                                        new ChatAction("Log In", ChatRoutes.LOGIN));
                }
                List<Booking> bookings = bookingRepository.findByUserUserId(user.getUserId());
                long pending = bookings.stream().filter(b -> b.getStatus() == BookingStatus.PENDING).count();
                String pendingNote = pending > 0
                                ? " You currently have " + pending + " request(s) still waiting on a provider response."
                                : "";
                return ChatResponse.of(
                                "After you submit a booking, the provider reviews and can accept it — customers don't "
                                                + "accept requests themselves." + pendingNote
                                                + " If a provider doesn't respond or "
                                                + "cancels, the booking will show as CANCELLED rather than staying pending "
                                                + "indefinitely; you can always check the current status in My Bookings.",
                                new ChatAction("View My Bookings", ChatRoutes.MY_BOOKINGS));
        }

        private ChatResponse bookingCancel(Role role, User user) {
                if (role == Role.PROVIDER) {
                        return ChatResponse.of(
                                        "You can cancel a booking you've accepted from your Provider Dashboard. Cancelling "
                                                        + "notifies the customer immediately, so it's best to only do this when you "
                                                        + "genuinely can't complete the job. A booking that's already COMPLETED or "
                                                        + "already CANCELLED can't be cancelled again.");
                }
                if (user == null) {
                        return ChatResponse.of(
                                        "Cancellation generally works like this: open the booking from My Bookings and cancel "
                                                        + "it there, as long as it isn't already completed or cancelled. Log in to "
                                                        + "manage your own bookings.",
                                        new ChatAction("Log In", ChatRoutes.LOGIN));
                }
                return ChatResponse.of(
                                "If you need to cancel a booking, open My Bookings and select the booking you want to "
                                                + "cancel. Before confirming, check the current status — a booking that's already "
                                                + "COMPLETED or CANCELLED can't be cancelled again. If cancelling isn't available "
                                                + "for a booking that should still be cancellable, please contact Help & Support "
                                                + "with the booking details so it can be reviewed.",
                                new ChatAction("View My Bookings", ChatRoutes.MY_BOOKINGS));
        }

        private ChatResponse bookingReschedule() {
                return ChatResponse.of(
                                "I don't see a dedicated reschedule feature in Fixly right now — changing the date or "
                                                + "address of an existing booking isn't something I can confirm is supported. If "
                                                + "your plans have changed, the safest option is to cancel the current booking (if "
                                                + "it's still cancellable) and create a new one with the correct date or address.",
                                new ChatAction("View My Bookings", ChatRoutes.MY_BOOKINGS));
        }

        private ChatResponse bookingOtp(Role role, User user) {
                if (role == Role.PROVIDER) {
                        ServiceProvider provider = providerRepository.findByUser_UserId(user.getUserId()).orElse(null);
                        long activeAccepted = provider == null ? 0
                                        : bookingRepository.findByProviderProviderId(provider.getProviderId()).stream()
                                                        .filter(b -> b.getStatus() == BookingStatus.ACCEPTED).count();
                        String note = activeAccepted > 0
                                        ? " You have " + activeAccepted + " accepted booking(s) awaiting the OTP."
                                        : "";
                        return ChatResponse.of(
                                        "The OTP is provided by the customer, not generated by you. Once you accept a "
                                                        + "booking, the customer receives an OTP that they should only share with you "
                                                        + "after the service is actually finished. Enter that OTP to mark the job "
                                                        + "COMPLETED." + note);
                }
                if (user == null) {
                        return ChatResponse.of(
                                        "Once a provider accepts your booking, you'll receive an OTP — share it with them "
                                                        + "only after the service is actually completed, since that's what marks the "
                                                        + "job done. Log in to view the OTP on your own accepted booking.",
                                        new ChatAction("Log In", ChatRoutes.LOGIN));
                }
                List<Booking> bookings = bookingRepository.findByUserUserId(user.getUserId());
                boolean hasAcceptedBooking = bookings.stream().anyMatch(b -> b.getStatus() == BookingStatus.ACCEPTED);
                String availability = hasAcceptedBooking
                                ? "You have an accepted booking with an active OTP — you can find it in that booking's details in My Bookings."
                                : "You don't currently have an accepted booking, so there's no active OTP right now.";
                return ChatResponse.of(
                                availability + " Important: only share the OTP with your provider after the service has "
                                                + "actually been completed to your satisfaction — sharing it beforehand lets the "
                                                + "booking be marked complete before the work is done. If the OTP shown isn't "
                                                + "working, please contact Help & Support with your booking details rather than "
                                                + "guessing at it.",
                                new ChatAction("View My Bookings", ChatRoutes.MY_BOOKINGS));
        }

        private ChatResponse bookingQueue(Role role, User user) {
                if (role != Role.PROVIDER) {
                        if (user == null) {
                                return ChatResponse.of(
                                                "Log in to see all your bookings, including completed ones, in My Bookings.",
                                                new ChatAction("Log In", ChatRoutes.LOGIN));
                        }
                        return ChatResponse.of(
                                        "You can see all your bookings, including completed ones, in My Bookings.",
                                        new ChatAction("View My Bookings", ChatRoutes.MY_BOOKINGS));
                }
                ServiceProvider provider = providerRepository.findByUser_UserId(user.getUserId()).orElse(null);
                if (provider == null) {
                        return ChatResponse.of("I don't see an active provider profile on your account yet.");
                }
                List<Booking> bookings = bookingRepository.findByProviderProviderId(provider.getProviderId());
                return ChatResponse.of(summarizeProviderBookings(bookings)
                                + " If a specific booking you expect to see isn't in this list, it may not exist on your "
                                + "account, or something may need a closer look — in that case please reach out to Help & "
                                + "Support with the customer/date details so it can be checked.",
                                new ChatAction("Provider Dashboard", ChatRoutes.PROVIDER_DASHBOARD));
        }

        /* ===================== PAYMENT ===================== */

        private ChatResponse payment() {
                return ChatResponse.of(
                                "I'm not able to view individual payment or transaction details from here, and I can't "
                                                + "confirm specific payment processing behavior. If a payment was deducted but your "
                                                + "booking or payment status doesn't reflect it, please avoid retrying the payment "
                                                + "immediately. Instead, contact Help & Support with your booking reference so the "
                                                + "team can check the transaction directly. I can't provide a refund timeline, as I "
                                                + "don't have that information.",
                                new ChatAction("Help & Support", ChatRoutes.HELP_SUPPORT));
        }

        /* ===================== RATING ===================== */

        private ChatResponse rating(Role role, User user) {
                if (role == Role.PROVIDER) {
                        ServiceProvider provider = providerRepository.findByUser_UserId(user.getUserId()).orElse(null);
                        if (provider == null) {
                                return ChatResponse.of("I don't see an active provider profile on your account yet.");
                        }
                        long count = reviewRepository.countByBookingProviderProviderId(provider.getProviderId());
                        String ratingText = count > 0
                                        ? "Your profile currently shows a rating of " + provider.getRating()
                                                        + "★ based on " + count + " review(s)."
                                        : "Your profile doesn't have any reviews yet — new providers start without a rating "
                                                        + "until customers begin leaving reviews for completed jobs.";
                        return ChatResponse.of(ratingText + " Your rating updates automatically as customers review "
                                        + "your completed bookings — there's no manual way to edit it.");
                }
                return ChatResponse.of(
                                "You can rate a provider from a completed booking in My Bookings — reviews aren't "
                                                + "available until a booking is marked COMPLETED, and you can only submit one "
                                                + "review per booking. When comparing providers, it's worth looking at both the "
                                                + "star rating and the number of reviews — a 5.0 rating from 2 reviews and a 4.8 "
                                                + "rating from 100 reviews tell very different stories.",
                                new ChatAction("View My Bookings", ChatRoutes.MY_BOOKINGS));
        }

        /* ===================== ADDRESS ===================== */

        private ChatResponse address(User user) {
                if (user == null) {
                        return ChatResponse.of(
                                        "Addresses are tied to your account and used when booking a service. Log in to add "
                                                        + "or view your saved addresses.",
                                        new ChatAction("Log In", ChatRoutes.LOGIN));
                }
                List<String> cities = addressRepository.findDistinctCities();
                String cityNote = cities.isEmpty()
                                ? ""
                                : " Right now, addresses exist for these cities on Fixly: " + String.join(", ", cities)
                                                + ".";
                return ChatResponse.of(
                                "You can add an address when booking a service, and you're able to save more than one "
                                                + "address on your account." + cityNote
                                                + " I don't see an edit or delete option for "
                                                + "existing addresses in the app currently — if you added one incorrectly, please "
                                                + "add a corrected one and use Help & Support if the old one needs to be removed.",
                                new ChatAction("Help & Support", ChatRoutes.HELP_SUPPORT));
        }

        /* ===================== ACCOUNT ===================== */

        private ChatResponse account(Role role, User user) {
                if (user == null) {
                        return loginRequired("view or update your account details");
                }
                return ChatResponse.of(
                                "You can view and update your account details from your Profile page. If you're having "
                                                + "trouble logging in or seeing 'unauthorized' errors, that usually means your "
                                                + "session has expired and you'll need to log in again"
                                                + (role == Role.PROVIDER
                                                                ? ", or, less commonly, that your provider account has been suspended."
                                                                : "."),
                                new ChatAction("Open Profile", ChatRoutes.PROFILE));
        }

        private ChatResponse accountPassword(User user) {
                if (user == null) {
                        return ChatResponse.of(
                                        "Log in first, then you can update your password from the Change Password page. I "
                                                        + "don't see a self-service 'forgot password' flow currently available — if "
                                                        + "you're locked out, please contact Help & Support for account recovery.",
                                        new ChatAction("Log In", ChatRoutes.LOGIN));
                }
                return ChatResponse.of(
                                "You can update your password from the Change Password page while logged in. I don't see "
                                                + "a self-service 'forgot password' flow currently available in the app — if you're "
                                                + "locked out and can't remember your credentials, please contact Help & Support for "
                                                + "account recovery.",
                                new ChatAction("Change Password", ChatRoutes.CHANGE_PASSWORD));
        }

        /* ===================== NOTIFICATIONS ===================== */

        private ChatResponse notification(User user) {
                if (user == null) {
                        return loginRequired("view your notifications");
                }
                long unread = notificationService.getUnreadCount(user.getUserId());
                String text = unread > 0
                                ? "You currently have " + unread
                                                + " unread notification(s). Notifications are sent for "
                                                + "things like new bookings, status changes, and provider updates — you can view "
                                                + "and mark them as read from your Notifications section."
                                : "You're all caught up — no unread notifications right now.";
                return ChatResponse.of(text, new ChatAction("View Notifications", ChatRoutes.NOTIFICATIONS));
        }

        /* ===================== SUPPORT ===================== */

        private ChatResponse support(Role role) {
                return ChatResponse.of(
                                "I can help narrow this down. What's going on?",
                                new ChatAction("Help & Support", ChatRoutes.HELP_SUPPORT))
                                .withSuggestions(role == Role.PROVIDER
                                                ? List.of("I'm not receiving bookings", "Customer OTP isn't working",
                                                                "My verification is stuck", "Payment/payout issue",
                                                                "Something else")
                                                : List.of("I can't create a booking", "Booking is stuck on pending",
                                                                "Provider cancelled it", "Payment failed",
                                                                "Something else"));
        }

        /* ===================== PROVIDER ===================== */

        private ChatResponse providerRegistration(Role role) {
                if (role == Role.PROVIDER) {
                        return ChatResponse.of(
                                        "You're already registered as a provider on Fixly. If you're asking about updating "
                                                        + "your existing application, I don't see a direct edit option beyond the "
                                                        + "re-application flow that's available after a rejection.");
                }
                return ChatResponse.of(
                                "You can apply to become a Fixly provider by submitting your service category, "
                                                + "experience, pricing, and identity verification documents (PAN and Aadhaar, plus "
                                                + "front/back images). After you apply, your application status starts as PENDING "
                                                + "and moves through Fixly's review process — I can't guarantee approval or an "
                                                + "exact timeline, since that depends on the review itself.",
                                new ChatAction("Become a Provider", ChatRoutes.BECOME_PROVIDER));
        }

        private ChatResponse providerVerification(User user) {
                // NOTE: user.role only flips to PROVIDER on approval (see
                // ProviderServiceImpl.approveProvider). Someone with a PENDING,
                // VERIFYING, or REJECTED application is still role=USER, so this
                // must be keyed on "is there a provider record at all", not role.
                if (user == null) {
                        return ChatResponse.of(
                                        "Fixly verifies providers by reviewing their submitted identity and service documents "
                                                        + "before their profile goes live, which is meant to help customers make more "
                                                        + "informed choices. Log in to check your own application's status.",
                                        new ChatAction("Log In", ChatRoutes.LOGIN));
                }

                ServiceProvider provider = providerRepository.findByUser_UserId(user.getUserId()).orElse(null);
                if (provider == null) {
                        return ChatResponse.of(
                                        "I don't see a provider application on your account yet.",
                                        new ChatAction("Become a Provider", ChatRoutes.BECOME_PROVIDER));
                }

                String statusText = switch (provider.getStatus()) {
                        case PENDING ->
                                "Your application is PENDING — it hasn't started formal verification review yet.";
                        case VERIFYING ->
                                "Your documents are currently VERIFYING — the Fixly team is reviewing them now.";
                        case APPROVED -> "Your provider application is APPROVED — you're clear to accept bookings.";
                        case REJECTED ->
                                "Your application was REJECTED. You can update your documents and details and re-apply.";
                        case SUSPENDED ->
                                "Your provider account is currently SUSPENDED, separate from the verification process.";
                };
                return ChatResponse.of(statusText + " I can't guarantee approval or give you an exact timeline, "
                                + "since that depends on Fixly's review process.",
                                provider.getStatus() == ProviderStatus.REJECTED
                                                ? new ChatAction("Become a Provider", ChatRoutes.BECOME_PROVIDER)
                                                : null);
        }

        private ChatResponse providerAvailability(Role role, User user) {
                if (role != Role.PROVIDER) {
                        return ChatResponse.of(
                                        "Provider availability is managed by the provider themselves and affects whether "
                                                        + "they show up in search results — it's not something customers control.");
                }
                ServiceProvider provider = providerRepository.findByUser_UserId(user.getUserId()).orElse(null);
                if (provider == null) {
                        return ChatResponse.of("I don't see an active provider profile on your account yet.",
                                        new ChatAction("Become a Provider", ChatRoutes.BECOME_PROVIDER));
                }
                String status = provider.getStatus().name();
                String availableText = provider.isAvailable() ? "ON" : "OFF";
                return ChatResponse.of(
                                "Your provider status is currently " + status + " and your availability toggle is "
                                                + "currently " + availableText
                                                + ". To receive booking requests, your account "
                                                + "generally needs to be APPROVED and your availability turned ON. You can flip "
                                                + "your availability from the toggle on your Provider Dashboard. If both of "
                                                + "those look right and you're still not receiving requests, it may be related to "
                                                + "demand in your category or city, which I can't verify from here — I'd suggest "
                                                + "checking your profile details are accurate or reaching out to Help & Support.",
                                new ChatAction("Provider Dashboard", ChatRoutes.PROVIDER_DASHBOARD));
        }

        private ChatResponse providerProfile(Role role, User user) {
                if (role != Role.PROVIDER) {
                        return ChatResponse.of(
                                        "Provider profile details (experience, pricing, category) are managed by the "
                                                        + "provider on their own account.");
                }
                return ChatResponse.of(
                                "I don't see a feature for directly editing your price, experience, or category after "
                                                + "your provider profile is approved. The only update path I can confirm is the "
                                                + "re-application process, which is available if your application was rejected. For "
                                                + "anything beyond that, please check with Help & Support since I can't confirm an "
                                                + "editing feature exists from here.",
                                new ChatAction("Help & Support", ChatRoutes.HELP_SUPPORT));
        }

        private ChatResponse providerSuspension(Role role, User user) {
                if (role != Role.PROVIDER) {
                        return ChatResponse.of(
                                        "Provider account suspension is a status the Fixly team applies to provider "
                                                        + "accounts, separate from customer accounts.");
                }
                ServiceProvider provider = providerRepository.findByUser_UserId(user.getUserId()).orElse(null);
                boolean isSuspended = provider != null && provider.getStatus() == ProviderStatus.SUSPENDED;
                String statusNote = provider == null
                                ? "I don't see a provider profile on your account."
                                : isSuspended
                                                ? "Your provider account currently shows as SUSPENDED."
                                                : "Your provider account doesn't currently show as suspended (status: "
                                                                + provider.getStatus() + ").";
                return ChatResponse.of(
                                statusNote + " I can't lift a suspension or guarantee reinstatement from here — that "
                                                + "requires review by the Fixly team. Please contact Help & Support with your "
                                                + "provider details so they can look into it.",
                                new ChatAction("Help & Support", ChatRoutes.HELP_SUPPORT));
        }

        /* ===================== FALLBACK ===================== */

        private ChatResponse fallback(Role role) {
                String text = role == Role.PROVIDER
                                ? "I'm not fully sure what you need yet. I can help with booking requests, verification "
                                                + "status, availability, your provider profile, ratings, or support."
                                : role == Role.USER
                                                ? "I'm not fully sure what you need yet. I can help with finding a service, bookings, "
                                                                + "provider registration, ratings, account questions, or support."
                                                : "I'm not fully sure what you need yet. I can help with finding a service, "
                                                                + "explaining how Fixly works, or how to become a provider. Log in for "
                                                                + "account-specific help like bookings and ratings.";
                return ChatResponse.of(text, new ChatAction("Help & Support", ChatRoutes.HELP_SUPPORT))
                                .withFollowUp(true);
        }

        /* ===================== INTENT RESOLUTION ===================== */

        private ChatIntent resolveIntent(ChatTopic topic, Role role) {
                boolean isProvider = role == Role.PROVIDER;
                return switch (topic) {
                        case EMERGENCY -> ChatIntent.EMERGENCY;
                        case GREETING -> ChatIntent.GENERAL_GREETING;
                        case THANKS -> ChatIntent.GENERAL_THANKS;
                        case GOODBYE -> ChatIntent.GENERAL_GOODBYE;
                        case SMALL_TALK -> ChatIntent.GENERAL_SMALL_TALK;
                        case FIXLY_INFO -> ChatIntent.GENERAL_FIXLY_INFO;
                        case SERVICE_SEARCH -> ChatIntent.USER_SERVICE_SEARCH;
                        case BOOKING_CREATE -> ChatIntent.USER_BOOKING_CREATE;
                        case BOOKING_STATUS, BOOKING_ACCEPT_REJECT ->
                                isProvider ? ChatIntent.PROVIDER_BOOKING : ChatIntent.USER_BOOKING_STATUS;
                        case BOOKING_CANCEL ->
                                isProvider ? ChatIntent.PROVIDER_BOOKING : ChatIntent.USER_BOOKING_CANCEL;
                        case BOOKING_RESCHEDULE -> ChatIntent.USER_BOOKING_RESCHEDULE;
                        case BOOKING_OTP -> isProvider ? ChatIntent.PROVIDER_BOOKING : ChatIntent.USER_BOOKING_OTP;
                        case BOOKING_QUEUE -> ChatIntent.PROVIDER_BOOKING;
                        case PAYMENT -> ChatIntent.USER_PAYMENT;
                        case RATING -> isProvider ? ChatIntent.PROVIDER_RATING : ChatIntent.USER_RATING;
                        case ADDRESS -> ChatIntent.USER_ADDRESS;
                        case ACCOUNT, ACCOUNT_PASSWORD ->
                                isProvider ? ChatIntent.PROVIDER_ACCOUNT : ChatIntent.USER_ACCOUNT;
                        case NOTIFICATION -> ChatIntent.USER_NOTIFICATION;
                        case SUPPORT -> isProvider ? ChatIntent.PROVIDER_SUPPORT : ChatIntent.USER_SUPPORT;
                        case PROVIDER_REGISTRATION -> ChatIntent.PROVIDER_REGISTRATION;
                        case PROVIDER_VERIFICATION -> ChatIntent.PROVIDER_VERIFICATION;
                        case PROVIDER_AVAILABILITY -> ChatIntent.PROVIDER_AVAILABILITY;
                        case PROVIDER_PROFILE -> ChatIntent.PROVIDER_PROFILE;
                        case PROVIDER_SUSPENSION -> ChatIntent.PROVIDER_SUSPENSION;
                        default -> ChatIntent.UNKNOWN;
                };
        }

        private String safe(String s) {
                return s == null ? "your provider" : s;
        }
}