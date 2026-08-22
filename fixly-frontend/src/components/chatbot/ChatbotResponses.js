/**
 * =============================================================================
 * FIXLY CHATBOT RESPONSE / DATA LOGIC MODULE — PHASE 3
 * =============================================================================
 *
 * PUBLIC API:
 *   - QUICK_QUESTIONS            (alias of USER_QUICK_QUESTIONS, kept for
 *                                  backward compatibility with existing
 *                                  Home-page usage)
 *   - USER_QUICK_QUESTIONS
 *   - PROVIDER_QUICK_QUESTIONS
 *   - getQuickQuestions(role)
 *   - getResponseById(id)        (async — returns a Promise)
 *   - getResponseForText(text)   (async — returns a Promise)
 *
 * BEHAVIOR:
 *   - Uses the app's existing `fixlyApi` axios instance for every backend
 *     call, so it automatically inherits the real Basic-auth header from
 *     fixlyApi's request interceptor. No separate auth handling here.
 *   - GUEST (no stored credentials — e.g. visiting Home while logged out):
 *     answers come from the local static engine below. This preserves the
 *     exact Phase 1 experience with no backend call at all.
 *   - AUTHENTICATED (User Dashboard / Provider Dashboard): every message
 *     goes to POST /api/chat for a real, role-aware, data-backed answer.
 *     If that call fails, we show an explicit "having trouble connecting"
 *     message rather than silently substituting a generic guest answer,
 *     since a logged-in person reasonably expects an account-aware reply.
 *   - `lastIntent` is remembered across calls in this session so short
 *     follow-up replies ("Deep cleaning") can be understood by the backend.
 * =============================================================================
 */

import fixlyApi from "../../api/fixlyApi";

/* -----------------------------------------------------------------------
 * BACKEND CALL
 * ---------------------------------------------------------------------- */

function hasStoredCredentials() {
  if (typeof window === "undefined" || !window.localStorage) return false;
  return Boolean(window.localStorage.getItem("auth"));
}

/** Thrown when the person IS logged in but the /api/chat call itself failed
 *  (network issue, 5xx, etc.) — distinct from simply being logged out. */
class ChatApiUnavailableError extends Error {}

let lastIntent = null;

/**
 * Returns a backend response, or `null` if there are no stored credentials
 * (guest — caller should use the local engine). Throws
 * ChatApiUnavailableError if credentials exist but the call failed.
 */
async function callChatApi(message) {
  if (!hasStoredCredentials()) return null;

  try {
    const res = await fixlyApi.post("/api/chat", { message, lastIntent });
    lastIntent = res.data?.intent || null;
    return {
      text: res.data?.text,
      action: res.data?.action || undefined,
      suggestions: res.data?.suggestions || undefined,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Fixly Assistant: /api/chat request failed", err);
    throw new ChatApiUnavailableError();
  }
}

/* -----------------------------------------------------------------------
 * TEXT NORMALIZATION HELPERS (local fallback engine — guests only)
 * ---------------------------------------------------------------------- */

function normalizeText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(normalized) {
  return normalized.length ? normalized.split(" ") : [];
}

function matchesKeyword(normalized, tokens, keyword) {
  if (keyword.includes(" ")) {
    return normalized.includes(keyword);
  }
  return tokens.includes(keyword);
}

function containsAny(normalized, tokens, keywords) {
  return keywords.some((kw) => matchesKeyword(normalized, tokens, kw));
}

function pickRandom(list) {
  if (Array.isArray(list)) {
    return list[Math.floor(Math.random() * list.length)];
  }
  return list;
}

/* -----------------------------------------------------------------------
 * KNOWN APP ROUTES
 * ---------------------------------------------------------------------- */

const ROUTES = {
  SEARCH: "/search",
  BECOME_PROVIDER: "/become-provider",
  MY_BOOKINGS: "/user/bookings",
  USER_DASHBOARD: "/user/dashboard",
  PROVIDER_DASHBOARD: "/provider/dashboard",
  PROFILE: "/profile",
  CHANGE_PASSWORD: "/change-password",
  HELP_SUPPORT: "/help-support",
  NOTIFICATIONS: "/notifications",
  BOOK: "/book",
};

/* -----------------------------------------------------------------------
 * LOCAL FALLBACK RESPONSE BANK (guests only — logged-out Home visitors)
 * ---------------------------------------------------------------------- */

const RESPONSES = {
  greeting: {
    text: [
      "Hi! 👋 Welcome to Fixly. I'm the Fixly Assistant. I can help you find services, understand bookings, become a provider, or answer questions about how Fixly works. What can I help you with today?",
      "Hello there! 👋 I'm the Fixly Assistant. Ask me about finding a service, booking, provider registration, safety, or anything else about Fixly.",
      "Hey! Great to see you on Fixly. I can help you find a service professional, explain how bookings work, or guide you to the right page — what do you need?",
      "Namaste! 🙏 Welcome to Fixly. I'm here to help with services, bookings, provider sign-up, or general questions. How can I help?",
    ],
  },
  thanks: {
    text: [
      "You're very welcome! 😊 I'm here whenever you need help with Fixly.",
      "You're welcome! If you need a service, I can also help you find the right category.",
      "Happy to help! Let me know if there's anything else about Fixly I can explain.",
    ],
  },
  goodbye: {
    text: [
      "Take care! 👋 If you need a service later, Fixly will be here to help.",
      "Goodbye for now! Come back anytime you need help finding a service on Fixly.",
    ],
  },
  small_talk: {
    text: "I'm the Fixly Assistant 🤖. Log in and I can also answer questions specific to your account — bookings, provider status, and more. For now, I can help you understand Fixly, find the right service category, and explain how bookings and provider registration work.",
  },
  about_fixly: {
    text: "Fixly is a service marketplace that helps users discover and connect with service professionals for everyday home and personal service needs. Users can explore services, choose providers, manage bookings, and share ratings/reviews through the platform.",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },
  emergency: {
    text: "This sounds like it could be an emergency. Please prioritize safety first — move away from danger if needed and contact your local emergency services right away. Fixly isn't set up to handle urgent emergencies, so please don't wait on a booking for a situation like this.",
  },
  service_generic: {
    text: "Fixly covers a wide range of home and personal services — including plumbing, electrical work, home cleaning, appliance repair, painting, carpentry, AC repair, pest control, salon/beauty, gardening, moving assistance, and event-related services. 🛠 You can browse everything currently available and pick what fits your need.",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },
  service_plumbing: {
    text: "If you have an active water leak, first turn off the nearest water supply if it's safe to do so. For professional assistance, you can browse plumbing providers on Fixly. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },
  service_electrical: {
    text: "Please avoid handling exposed wires, switches, or electrical panels yourself. If there's smoke, a burning smell, sparks, or any immediate danger, move away from the area and contact the appropriate emergency service right away. For normal electrical work, you can find an electrician through Fixly. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },
  service_cleaning: {
    text: "Fixly can connect you with home cleaning professionals for general cleaning, deep cleaning, kitchen or bathroom cleaning, and more. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },
  service_childcare: {
    text: "Fixly can help you explore child-care service options such as babysitters, nannies, or child attendants. Availability depends on your location and the providers listed on Fixly. I can't make medical, legal, or safety guarantees — always review provider details before booking.",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },
  booking_how: {
    text:
      "Booking a service on Fixly generally works like this:\n\n" +
      "1. Choose a service category\n" +
      "2. Browse and select a provider\n" +
      "3. Enter the required address/details\n" +
      "4. Pick a date and other service details\n" +
      "5. Confirm the booking request\n" +
      "6. The provider receives and manages your request\n" +
      "7. You can track the booking status from your dashboard\n" +
      "8. Fixly may use an OTP-based verification step when the service is completed\n\n" +
      "Log in to ask me about a specific booking of yours.",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },
  booking_status_quick: {
    text: "I don't have visibility into a specific booking from here, but once you're logged in you can check real-time status — pending, accepted, completed, or cancelled — from your Bookings section.",
    action: { label: "View My Bookings", to: ROUTES.MY_BOOKINGS },
  },
  cancellation_quick: {
    text: "Cancellation options depend on your booking's current status. Log in and open the booking from My Bookings to see what's available for it.",
    action: { label: "View My Bookings", to: ROUTES.MY_BOOKINGS },
  },
  payment_quick: {
    text: "Payment happens as part of the booking flow. I can't quote specific pricing or transaction details here — please check the provider/service listing for current pricing, or log in for account-specific help.",
  },
  provider_register: {
    text: "Service professionals can join Fixly through the Become a Provider process. You'll be asked to provide service and verification information before your provider profile can be reviewed. 🚀",
    action: { label: "Become a Provider", to: ROUTES.BECOME_PROVIDER },
  },
  safety_trust: {
    text: "Fixly is designed with several layers meant to help users make more informed decisions — provider verification and review, booking management, OTP-based service verification/completion, ratings and reviews, account authentication, and administrative oversight. 🛡",
  },
  ratings_reviews: {
    text: "You can use provider ratings and reviews to compare professionals before making a booking. ⭐",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },
  help_support: {
    text: "I'm sorry to hear you're running into an issue. 💬 Log in so I can look into your account, or head to Help & Support directly.",
    action: { label: "Help & Support", to: ROUTES.HELP_SUPPORT },
  },
  fallback: {
    text: "I'm not completely sure what you need yet. I can help with Fixly services, bookings, provider registration, ratings, or support. Log in for account-specific answers. For example, you can ask \"I need a plumber\" or \"How does booking work?\"",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },
};

const INTENTS = [
  { id: "emergency", priority: 1000, keywords: ["fire", "gas leak", "sparks", "electric shock", "smoke", "explosion", "medical emergency", "bleeding"], responseId: "emergency" },
  { id: "provider_register", priority: 910, keywords: ["become provider", "become a provider", "join fixly", "register as provider", "how can i become a provider"], responseId: "provider_register" },
  { id: "booking_status_quick", priority: 855, keywords: ["booking status", "where is my booking", "my booking", "track my booking"], responseId: "booking_status_quick" },
  { id: "cancellation_quick", priority: 850, keywords: ["cancel my booking", "cancel booking", "how to cancel", "cancellation"], responseId: "cancellation_quick" },
  { id: "booking_how", priority: 840, keywords: ["how to book", "book service", "make booking", "booking", "how does booking work", "want to book", "can i book"], responseId: "booking_how" },
  { id: "payment_quick", priority: 820, keywords: ["payment", "pay", "how does payment work", "payment work"], responseId: "payment_quick" },
  { id: "safety_trust", priority: 810, keywords: ["is fixly safe", "safe", "trusted", "verified", "trust"], responseId: "safety_trust" },
  { id: "ratings_reviews", priority: 800, keywords: ["rating", "ratings", "review", "reviews"], responseId: "ratings_reviews" },
  { id: "help_support", priority: 750, keywords: ["help", "support", "contact", "problem", "issue", "complaint"], responseId: "help_support" },
  { id: "about_fixly", priority: 700, keywords: ["what is fixly", "about fixly", "how does fixly work"], responseId: "about_fixly" },
  { id: "service_childcare", priority: 600, keywords: ["child care", "childcare", "babysitter", "nanny"], responseId: "service_childcare" },
  { id: "service_plumbing", priority: 600, keywords: ["plumber", "plumbing", "pipe leak", "leaking tap"], responseId: "service_plumbing" },
  { id: "service_electrical", priority: 600, keywords: ["electrician", "electrical", "wiring", "fan"], responseId: "service_electrical" },
  { id: "service_cleaning", priority: 600, keywords: ["cleaning", "cleaner", "house cleaning"], responseId: "service_cleaning" },
  { id: "service_generic", priority: 500, keywords: ["find a service", "what services", "services available"], responseId: "service_generic" },
  { id: "small_talk", priority: 400, keywords: ["what can you do", "who are you", "are you a bot", "are you human"], responseId: "small_talk" },
  { id: "thanks", priority: 390, keywords: ["thanks", "thank you", "thx"], responseId: "thanks" },
  { id: "goodbye", priority: 380, keywords: ["bye", "goodbye", "see you"], responseId: "goodbye" },
  { id: "greeting", priority: 300, keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "namaste"], responseId: "greeting" },
];

const SORTED_INTENTS = [...INTENTS].sort((a, b) => b.priority - a.priority);

function detectLocalIntent(rawText) {
  const normalized = normalizeText(rawText);
  if (!normalized) return null;
  const tokens = tokenize(normalized);
  for (const intent of SORTED_INTENTS) {
    if (containsAny(normalized, tokens, intent.keywords)) return intent;
  }
  return null;
}

function buildLocalResponse(entry) {
  if (!entry) return buildLocalResponse(RESPONSES.fallback);
  const text = pickRandom(entry.text);
  const response = { text };
  if (entry.action) response.action = { ...entry.action };
  return response;
}

function getLocalResponseForText(text) {
  const intent = detectLocalIntent(text);
  const entry = intent ? RESPONSES[intent.responseId] : RESPONSES.fallback;
  return buildLocalResponse(entry);
}

/* -----------------------------------------------------------------------
 * CONNECTION ERROR (shown only to authenticated users whose /api/chat
 * call actually failed — never shown to guests, who just get the local
 * engine instead)
 * ---------------------------------------------------------------------- */

const CONNECTION_ERROR_RESPONSE = {
  text: "Sorry, I'm having trouble connecting right now. Please try again in a moment or visit Help & Support.",
  action: { label: "Help & Support", to: ROUTES.HELP_SUPPORT },
};

/* -----------------------------------------------------------------------
 * QUICK QUESTIONS — role-aware
 * ---------------------------------------------------------------------- */

export const USER_QUICK_QUESTIONS = [
  { id: "booking_how", label: "How does booking work?" },
  { id: "service_generic", label: "Find a service" },
  { id: "booking_status_quick", label: "Where is my booking?" },
  { id: "cancellation_quick", label: "How can I cancel a booking?" },
  { id: "payment_quick", label: "How does payment work?" },
  { id: "provider_register", label: "How can I become a provider?" },
];

export const PROVIDER_QUICK_QUESTIONS = [
  { id: "provider_manage_bookings", label: "How do I manage bookings?" },
  { id: "provider_accept_booking", label: "How do I accept a booking?" },
  { id: "provider_otp", label: "How does OTP verification work?" },
  { id: "provider_complete_service", label: "How do I complete a service?" },
  { id: "provider_availability", label: "How can I manage availability?" },
  { id: "provider_ratings", label: "How do ratings work?" },
];

// Backward compatible with existing Home-page usage, which imports
// QUICK_QUESTIONS directly and doesn't know about roles.
export const QUICK_QUESTIONS = USER_QUICK_QUESTIONS;

/** Pick the right quick-question set for a role ("PROVIDER" or anything
 *  else, including null/undefined for guests). */
export function getQuickQuestions(role) {
  return role === "PROVIDER" ? PROVIDER_QUICK_QUESTIONS : USER_QUICK_QUESTIONS;
}

const ALL_QUICK_QUESTIONS = [...USER_QUICK_QUESTIONS, ...PROVIDER_QUICK_QUESTIONS];

/* -----------------------------------------------------------------------
 * PUBLIC API (async)
 * ---------------------------------------------------------------------- */

export async function getResponseById(id) {
  const question = ALL_QUICK_QUESTIONS.find((q) => q.id === id);
  const label = question ? question.label : id;

  try {
    const backendResponse = await callChatApi(label);
    if (backendResponse) return backendResponse;
  } catch (err) {
    if (err instanceof ChatApiUnavailableError) return CONNECTION_ERROR_RESPONSE;
    throw err;
  }

  // No stored credentials -> guest -> local engine
  return buildLocalResponse(RESPONSES[id]);
}

export async function getResponseForText(text) {
  try {
    const backendResponse = await callChatApi(text);
    if (backendResponse) return backendResponse;
  } catch (err) {
    if (err instanceof ChatApiUnavailableError) return CONNECTION_ERROR_RESPONSE;
    throw err;
  }

  // No stored credentials -> guest -> local engine
  return getLocalResponseForText(text);
}