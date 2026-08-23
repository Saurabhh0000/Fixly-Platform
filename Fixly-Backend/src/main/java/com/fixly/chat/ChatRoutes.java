package com.fixly.chat;

/**
 * ONLY routes confirmed to exist in the React app (verified against
 * App.jsx). Do not add a route here unless you've verified it's real — the
 * assistant must never generate a broken navigation button.
 */
public final class ChatRoutes {
    private ChatRoutes() {
    }

    public static final String SEARCH = "/search";
    public static final String BECOME_PROVIDER = "/become-provider";
    public static final String MY_BOOKINGS = "/user/bookings";
    public static final String USER_DASHBOARD = "/user/dashboard";
    public static final String PROVIDER_DASHBOARD = "/provider/dashboard";
    public static final String PROFILE = "/profile";
    public static final String CHANGE_PASSWORD = "/change-password";
    public static final String HELP_SUPPORT = "/help-support";
    public static final String NOTIFICATIONS = "/notifications";
    public static final String BOOK = "/book";
    public static final String LOGIN = "/login";
}