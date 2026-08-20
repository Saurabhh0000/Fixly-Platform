/**
 * =============================================================================
 * FIXLY CHATBOT RESPONSE / DATA LOGIC MODULE
 * =============================================================================
 *
 * This module owns ALL chatbot "intelligence" — intent detection, response
 * text, and suggested navigation actions. The React chatbot component
 * (FixlyChatbot.jsx) is intentionally kept dumb: it just renders whatever
 * { text, action? } shape this module returns.
 *
 * PUBLIC API (do not rename/remove — the UI depends on these):
 *   - QUICK_QUESTIONS
 *   - getResponseById(id)
 *   - getResponseForText(text)
 *
 * DESIGN NOTES:
 *   - This is a stateless response ENGINE. It explains things and can point
 *     the user to the right page, but it never claims to have performed a
 *     real action (booking, payment, cancellation, password change, etc.).
 *   - Response text/action lives in RESPONSES.
 *   - Intent-to-response mapping + matching rules live in INTENTS.
 *   - Higher `priority` intents are checked first, so multi-word / more
 *     specific phrases (e.g. "become a provider") win over generic single
 *     keywords (e.g. "plumber") when both appear in the same message.
 *   - getResponseForText() is deliberately synchronous and side-effect free
 *     so it can later be swapped for an async backend call, e.g.:
 *
 *       export async function getResponseForText(text) {
 *         const res = await fixlyApi.post("/api/chat", { message: text });
 *         return res.data;
 *       }
 *
 *     without the calling React component needing any changes.
 * =============================================================================
 */

/* -----------------------------------------------------------------------
 * TEXT NORMALIZATION HELPERS
 * ---------------------------------------------------------------------- */

/**
 * Lowercases, trims, and strips punctuation so matching is resilient to
 * "Hi!", "HELLO.", "book-service", etc.
 */
function normalizeText(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, " ") // strip punctuation, keep word chars/spaces
    .replace(/\s+/g, " ")
    .trim();
}

/** Splits normalized text into individual word tokens. */
function tokenize(normalized) {
  return normalized.length ? normalized.split(" ") : [];
}

/**
 * Checks whether a single keyword matches the message.
 * - Multi-word keywords ("become a provider") are matched as a substring.
 * - Single-word keywords ("hi", "ac", "fee") are matched as a whole token,
 *   so short/common words don't false-positive inside longer words
 *   (e.g. "hi" should not match inside "this").
 */
function matchesKeyword(normalized, tokens, keyword) {
  if (keyword.includes(" ")) {
    return normalized.includes(keyword);
  }
  return tokens.includes(keyword);
}

/** True if any keyword in the list matches the message. */
function containsAny(normalized, tokens, keywords) {
  return keywords.some((kw) => matchesKeyword(normalized, tokens, kw));
}

/** True if any regex pattern in the list matches the message. */
function matchesAny(normalized, patterns) {
  if (!patterns || !patterns.length) return false;
  return patterns.some((pattern) => pattern.test(normalized));
}

/** Picks a random element from an array (used to vary phrasing). */
function pickRandom(list) {
  if (Array.isArray(list)) {
    return list[Math.floor(Math.random() * list.length)];
  }
  return list;
}

/* -----------------------------------------------------------------------
 * KNOWN APP ROUTES (do not invent routes beyond this list)
 * ---------------------------------------------------------------------- */

const ROUTES = {
  SEARCH: "/search",
  BECOME_PROVIDER: "/become-provider",
  MY_BOOKINGS: "/user/bookings",
  PROFILE: "/profile",
  CHANGE_PASSWORD: "/change-password",
  HELP_SUPPORT: "/help-support",
};

/* -----------------------------------------------------------------------
 * RESPONSE BANK
 * Each entry: { text: string | string[], action?: { label, to } }
 * `text` may be an array — one variant is chosen at random per call so the
 * bot doesn't repeat itself verbatim every time.
 * ---------------------------------------------------------------------- */

const RESPONSES = {
  // ---- Greetings -----------------------------------------------------
  greeting: {
    text: [
      "Hi! 👋 Welcome to Fixly. I'm the Fixly Assistant. I can help you find services, understand bookings, become a provider, or answer questions about how Fixly works. What can I help you with today?",
      "Hello there! 👋 I'm the Fixly Assistant. Ask me about finding a service, booking, provider registration, safety, or anything else about Fixly.",
      "Hey! Great to see you on Fixly. I can help you find a service professional, explain how bookings work, or guide you to the right page — what do you need?",
      "Namaste! 🙏 Welcome to Fixly. I'm here to help with services, bookings, provider sign-up, or general questions. How can I help?",
    ],
  },

  // ---- Thanks / Goodbye ----------------------------------------------
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

  // ---- Small talk ------------------------------------------------------
  small_talk: {
    text: "I'm the Fixly Assistant 🤖. I can help you understand Fixly, find the right service category, explain bookings, guide you through provider registration, and direct you to Help & Support.",
  },

  // ---- About Fixly -----------------------------------------------------
  about_fixly: {
    text: "Fixly is a service marketplace that helps users discover and connect with service professionals for everyday home and personal service needs. Users can explore services, choose providers, manage bookings, and share ratings/reviews through the platform.",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Emergency ---------------------------------------------------------
  emergency: {
    text: "This sounds like it could be an emergency. Please prioritize safety first — move away from danger if needed and contact your local emergency services right away. Fixly isn't set up to handle urgent emergencies, so please don't wait on a booking for a situation like this.",
  },

  // ---- Service discovery (generic) --------------------------------------
  service_generic: {
    text: "Fixly covers a wide range of home and personal services — including plumbing, electrical work, home cleaning, appliance repair, painting, carpentry, AC repair, pest control, salon/beauty, gardening, moving assistance, and event-related services. 🛠 You can browse everything currently available and pick what fits your need.",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Child care ---------------------------------------------------------
  service_childcare: {
    text: "Fixly can help you explore child-care service options available through the platform, such as babysitters, nannies, or child attendants. You can review provider information and choose a service that matches your requirements. Availability depends on your location and the providers listed on Fixly. Please note I can't make medical, legal, or safety guarantees — always review provider details carefully before booking.",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Plumbing ---------------------------------------------------------
  service_plumbing: {
    text: "If you have an active water leak, first turn off the nearest water supply if it's safe to do so — that can help limit damage while you arrange help. For professional assistance, you can browse plumbing providers on Fixly. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Electrical ---------------------------------------------------------
  service_electrical: {
    text: "Please avoid handling exposed wires, switches, or electrical panels yourself. If there's smoke, a burning smell, sparks, or any immediate danger, move away from the area and contact the appropriate emergency service right away. For normal electrical work, you can find an electrician through Fixly. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Cleaning ---------------------------------------------------------
  service_cleaning: {
    text: "Fixly can connect you with home cleaning professionals for general cleaning, deep cleaning, kitchen or bathroom cleaning, and more. You can browse available cleaning providers and pick what suits your home. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Appliance repair ---------------------------------------------------
  service_appliance: {
    text: "Fixly has providers for common appliance repairs — washing machines, refrigerators, microwaves, TVs, water purifiers (RO), and more. You can browse the appliance repair category to find a suitable professional. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- AC repair ---------------------------------------------------------
  service_ac: {
    text: "If your AC isn't cooling properly, common causes can include a dirty filter or restricted airflow, but a professional inspection is usually the best way to know for sure. You can browse AC repair services on Fixly. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Painting ---------------------------------------------------------
  service_painting: {
    text: "Fixly can help you find painting professionals for interior or exterior work. You can browse providers, compare their listed details, and choose one that fits your project. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Carpentry ---------------------------------------------------------
  service_carpentry: {
    text: "Fixly can connect you with carpentry professionals for repairs, furniture work, and similar needs. You can browse the carpentry category to see who's available. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Pest control ---------------------------------------------------------
  service_pest: {
    text: "Fixly can help you find pest control professionals for common household pest issues. You can browse providers and choose a service that fits your situation. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Salon / beauty ---------------------------------------------------------
  service_salon: {
    text: "Fixly can help you find salon and beauty service professionals for at-home or on-demand appointments. You can browse available providers and pick a service that suits you. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Gardening ---------------------------------------------------------
  service_gardening: {
    text: "Fixly can connect you with gardening and lawn care professionals. You can browse the gardening category to see available providers. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Moving / shifting ---------------------------------------------------------
  service_moving: {
    text: "Fixly can help you find moving and shifting assistance for your relocation needs. You can browse available providers and compare what they offer. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Event services ---------------------------------------------------------
  service_event: {
    text: "Fixly can help you explore event-related service providers. You can browse the relevant category to see what's currently available. 🛠",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Booking (how it works) ---------------------------------------------
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
      "You can get started by browsing services. 📅",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Booking status ---------------------------------------------------
  booking_status: {
    text: "I don't have visibility into your specific booking from here, but you can check its real-time status — pending, accepted, rejected, or completed — from your Bookings section. 📅",
    action: { label: "View My Bookings", to: ROUTES.MY_BOOKINGS },
  },

  // ---- Cancellation ---------------------------------------------------
  cancellation: {
    text: "Cancellation options and eligibility may depend on the current status of your booking and Fixly's applicable rules. Please open your booking to check the available options.",
    action: { label: "View My Bookings", to: ROUTES.MY_BOOKINGS },
  },

  // ---- Provider registration ---------------------------------------------------
  provider_register: {
    text: "Service professionals can join Fixly through the Become a Provider process. You'll be asked to provide service and verification information before your provider profile can be reviewed. 🚀",
    action: { label: "Become a Provider", to: ROUTES.BECOME_PROVIDER },
  },

  // ---- Provider verification ---------------------------------------------------
  provider_verification: {
    text: "Fixly uses a provider verification and review process to help maintain trust on the platform — this typically involves submitting identity and service-related documents for review. Approval depends on the outcome of that verification and review process, and I can't guarantee approval from here.",
    action: { label: "Become a Provider", to: ROUTES.BECOME_PROVIDER },
  },

  // ---- Safety / trust ---------------------------------------------------
  safety_trust: {
    text: "Fixly is designed with several layers meant to help users make more informed decisions — provider verification and review, booking management, OTP-based service verification/completion, ratings and reviews, account authentication, and administrative oversight. 🛡 That said, I can't guarantee any individual interaction — please review provider details before booking.",
  },

  // ---- Ratings / reviews ---------------------------------------------------
  ratings_reviews: {
    text: "You can use provider ratings and reviews to compare professionals before making a booking. ⭐ The actual rating shown for any provider comes from their recorded reviews on Fixly — I don't have a live number to share from here.",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Pricing ---------------------------------------------------------
  pricing: {
    text: "Service pricing can vary depending on the provider, service type, location, and specific requirements. Please check the available provider/service information on Fixly for current pricing — I don't have a fixed number to quote here.",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Location / availability ---------------------------------------------------
  location_availability: {
    text: "Service availability depends on the providers currently listed for your location. You can use Fixly's service search to explore what's actually available near you.",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },

  // ---- Account: profile ---------------------------------------------------
  account_profile: {
    text: "You can view and update your account details from your Profile page.",
    action: { label: "Open Profile", to: ROUTES.PROFILE },
  },

  // ---- Account: password ---------------------------------------------------
  account_password: {
    text: "You can update your password from the Change Password page. For your security, I can't change it for you from here.",
    action: { label: "Change Password", to: ROUTES.CHANGE_PASSWORD },
  },

  // ---- Help & support ---------------------------------------------------
  help_support: {
    text: "I'm sorry to hear you're running into an issue. 💬 For account-specific problems, complaints, or anything I can't resolve here, the Help & Support team can take a closer look.",
    action: { label: "Help & Support", to: ROUTES.HELP_SUPPORT },
  },

  // ---- Fallback ---------------------------------------------------
  fallback: {
    text: "I'm not completely sure what you need yet. I can help with Fixly services, bookings, provider registration, ratings, account questions, or support. For example, you can ask \"I need a plumber\" or \"How does booking work?\"",
    action: { label: "Browse Services", to: ROUTES.SEARCH },
  },
};

/* -----------------------------------------------------------------------
 * INTENTS
 * Each intent: { id, priority, keywords: [...], patterns?: [RegExp], responseId }
 * Higher priority is checked first. Keep specific/multi-word intents above
 * generic single-keyword ones so phrases like "become a provider because
 * I am a plumber" resolve to PROVIDER, not PLUMBING.
 * ---------------------------------------------------------------------- */

const INTENTS = [
  // ---- Emergency: always checked first ------------------------------
  {
    id: "emergency",
    priority: 1000,
    keywords: [
      "fire",
      "gas leak",
      "gas smell",
      "sparks",
      "electric shock",
      "shock",
      "injury",
      "injured",
      "bleeding",
      "medical emergency",
      "accident",
      "explosion",
      "smoke",
    ],
    responseId: "emergency",
  },

  // ---- Provider intents (must beat plain service keywords) ----------
  {
    id: "provider_verification",
    priority: 920,
    keywords: [
      "verification",
      "verify provider",
      "provider verification",
      "documents",
      "aadhaar",
      "pan card",
      "identity verification",
      "approval",
      "get verified",
    ],
    responseId: "provider_verification",
  },
  {
    id: "provider_register",
    priority: 910,
    keywords: [
      "become provider",
      "become a provider",
      "join fixly",
      "work with fixly",
      "service provider",
      "provider registration",
      "register as provider",
      "become a fixly provider",
      "offer services",
      "offer my services",
      "work on fixly",
      "sign up as provider",
    ],
    patterns: [/\bhow can i become a provider\b/],
    responseId: "provider_register",
  },

  // ---- Booking-related (higher than plain service keywords) ---------
  {
    id: "booking_status",
    priority: 860,
    keywords: [
      "booking status",
      "where is my booking",
      "my booking",
      "booking pending",
      "booking accepted",
      "booking rejected",
      "booking completed",
      "booking cancelled",
      "track my booking",
    ],
    responseId: "booking_status",
  },
  {
    id: "cancellation",
    priority: 850,
    keywords: [
      "cancel booking",
      "cancel my booking",
      "how to cancel",
      "cancellation",
      "cancel service",
      "cancel appointment",
    ],
    responseId: "cancellation",
  },
  {
    id: "booking_how",
    priority: 840,
    keywords: [
      "how to book",
      "book service",
      "make booking",
      "booking",
      "appointment",
      "schedule service",
      "how does booking work",
      "want to book",
      "can i book",
      "book a plumber",
      "book electrician",
      "book a service",
      "how do i book",
    ],
    responseId: "booking_how",
  },

  // ---- Safety / trust / ratings / pricing / location -----------------
  {
    id: "safety_trust",
    priority: 810,
    keywords: [
      "is fixly safe",
      "safe",
      "trusted",
      "verified",
      "security",
      "scam",
      "fraud",
      "trust",
      "trustworthy",
    ],
    responseId: "safety_trust",
  },
  {
    id: "ratings_reviews",
    priority: 800,
    keywords: [
      "rating",
      "ratings",
      "review",
      "reviews",
      "how to rate",
      "provider rating",
      "best provider",
      "feedback",
    ],
    responseId: "ratings_reviews",
  },
  {
    id: "pricing",
    priority: 790,
    keywords: [
      "price",
      "prices",
      "cost",
      "how much",
      "charges",
      "rate",
      "fee",
      "fees",
      "expensive",
      "cheap",
      "service cost",
    ],
    responseId: "pricing",
  },
  {
    id: "location_availability",
    priority: 780,
    keywords: [
      "location",
      "city",
      "area",
      "near me",
      "nearby",
      "available in my city",
      "available in delhi",
      "available in mumbai",
      "available in patna",
      "service availability",
    ],
    responseId: "location_availability",
  },

  // ---- Account -----------------------------------------------------
  {
    id: "account_password",
    priority: 770,
    keywords: [
      "change password",
      "forgot password",
      "reset password",
      "update password",
    ],
    responseId: "account_password",
  },
  {
    id: "account_profile",
    priority: 760,
    keywords: [
      "profile",
      "my account",
      "account",
      "login",
      "log in",
      "logout",
      "log out",
      "register",
      "registration",
      "sign up",
    ],
    responseId: "account_profile",
  },

  // ---- Help & Support -----------------------------------------------------
  {
    id: "help_support",
    priority: 750,
    keywords: [
      "help",
      "support",
      "contact",
      "contact fixly",
      "problem",
      "issue",
      "complaint",
      "report",
      "customer support",
      "need help",
    ],
    responseId: "help_support",
  },

  // ---- About Fixly -----------------------------------------------------
  {
    id: "about_fixly",
    priority: 700,
    keywords: [
      "what is fixly",
      "about fixly",
      "tell me about fixly",
      "what does fixly do",
      "why fixly",
      "how fixly works",
      "how does fixly work",
    ],
    responseId: "about_fixly",
  },

  // ---- Service-specific intents (checked after booking/provider) -----
  {
    id: "service_childcare",
    priority: 600,
    keywords: [
      "child care",
      "childcare",
      "baby care",
      "babysitter",
      "nanny",
      "caretaker",
      "kids care",
      "child attendant",
      "looking for childcare",
    ],
    responseId: "service_childcare",
  },
  {
    id: "service_plumbing",
    priority: 600,
    keywords: [
      "plumber",
      "plumbing",
      "pipe leak",
      "water leakage",
      "tap repair",
      "faucet",
      "sink",
      "drain",
      "toilet",
      "water pipe",
      "blocked drain",
      "leaking tap",
      "leaking pipe",
    ],
    responseId: "service_plumbing",
  },
  {
    id: "service_electrical",
    priority: 600,
    keywords: [
      "electrician",
      "electrical",
      "wiring",
      "switch",
      "socket",
      "fan",
      "light",
      "power issue",
      "electricity problem",
      "short circuit",
    ],
    responseId: "service_electrical",
  },
  {
    id: "service_cleaning",
    priority: 600,
    keywords: [
      "cleaning",
      "cleaner",
      "house cleaning",
      "home cleaning",
      "deep cleaning",
      "bathroom cleaning",
      "kitchen cleaning",
      "room cleaning",
      "clean my house",
    ],
    responseId: "service_cleaning",
  },
  {
    id: "service_appliance",
    priority: 600,
    keywords: [
      "appliance",
      "washing machine",
      "refrigerator",
      "fridge",
      "microwave",
      "ro",
      "water purifier",
      "appliance repair",
    ],
    responseId: "service_appliance",
  },
  {
    id: "service_ac",
    priority: 600,
    keywords: [
      "ac repair",
      "ac not cooling",
      "cooling problem",
      "ac service",
      "air conditioner",
      "air conditioning",
      "ac",
    ],
    responseId: "service_ac",
  },
  {
    id: "service_painting",
    priority: 600,
    keywords: ["painter", "painting", "paint my house", "wall painting"],
    responseId: "service_painting",
  },
  {
    id: "service_carpentry",
    priority: 600,
    keywords: ["carpenter", "carpentry", "furniture repair", "woodwork"],
    responseId: "service_carpentry",
  },
  {
    id: "service_pest",
    priority: 600,
    keywords: ["pest control", "pest problem", "pest", "termite", "cockroach", "insects"],
    responseId: "service_pest",
  },
  {
    id: "service_salon",
    priority: 600,
    keywords: ["salon", "beauty service", "beautician", "haircut", "spa", "makeup"],
    responseId: "service_salon",
  },
  {
    id: "service_gardening",
    priority: 600,
    keywords: ["gardening", "gardener", "lawn care", "landscaping"],
    responseId: "service_gardening",
  },
  {
    id: "service_moving",
    priority: 600,
    keywords: ["moving", "shifting", "relocation", "packers and movers", "movers"],
    responseId: "service_moving",
  },
  {
    id: "service_event",
    priority: 600,
    keywords: ["event", "event service", "party service", "decoration service"],
    responseId: "service_event",
  },

  // ---- Generic service discovery (broader, lower priority) -----------
  {
    id: "service_generic",
    priority: 500,
    keywords: [
      "find a service",
      "find service",
      "need a service",
      "what services",
      "services available",
      "what can you help with",
      "service categories",
      "list of services",
    ],
    responseId: "service_generic",
  },

  // ---- Small talk -----------------------------------------------------
  {
    id: "small_talk",
    priority: 400,
    keywords: [
      "what can you do",
      "who are you",
      "are you a bot",
      "are you human",
      "how are you",
    ],
    responseId: "small_talk",
  },

  // ---- Thanks / goodbye -----------------------------------------------------
  {
    id: "thanks",
    priority: 390,
    keywords: [
      "thanks",
      "thank you",
      "thankyou",
      "thx",
      "great thanks",
      "that's helpful",
      "thats helpful",
    ],
    responseId: "thanks",
  },
  {
    id: "goodbye",
    priority: 380,
    keywords: ["bye", "goodbye", "see you", "talk later", "see ya"],
    responseId: "goodbye",
  },

  // ---- Greeting (kept low-ish so it doesn't swallow real questions,
  //      but above fallback) -------------------------------------------
  {
    id: "greeting",
    priority: 300,
    keywords: [
      "hi",
      "hello",
      "hey",
      "hey there",
      "hello there",
      "hi there",
      "good morning",
      "good afternoon",
      "good evening",
      "namaste",
      "namaskar",
      "hi fixly",
      "hello fixly",
      "hey fixly",
      "are you there",
      "what is fixly",
    ],
    responseId: "greeting",
  },
];

// Sort once, descending by priority, so detectIntent always checks the
// most specific intents first.
const SORTED_INTENTS = [...INTENTS].sort((a, b) => b.priority - a.priority);

/* -----------------------------------------------------------------------
 * INTENT DETECTION
 * ---------------------------------------------------------------------- */

function detectIntent(rawText) {
  const normalized = normalizeText(rawText);
  if (!normalized) return null;

  const tokens = tokenize(normalized);

  for (const intent of SORTED_INTENTS) {
    const keywordHit = containsAny(normalized, tokens, intent.keywords || []);
    const patternHit = matchesAny(normalized, intent.patterns);
    if (keywordHit || patternHit) {
      return intent;
    }
  }

  return null;
}

/* -----------------------------------------------------------------------
 * RESPONSE BUILDING
 * ---------------------------------------------------------------------- */

/**
 * Converts a RESPONSES entry into the { text, action? } shape the chatbot
 * UI expects, resolving any randomized text variants.
 */
function buildResponse(entry) {
  if (!entry) {
    return buildResponse(RESPONSES.fallback);
  }
  const text = pickRandom(entry.text);
  const response = { text };
  if (entry.action) {
    response.action = { ...entry.action };
  }
  return response;
}

/* -----------------------------------------------------------------------
 * QUICK QUESTIONS
 * Shown as suggested prompts in the chatbot UI. Each maps to a responseId
 * that getResponseById() can resolve directly.
 * ---------------------------------------------------------------------- */

export const QUICK_QUESTIONS = [
  { id: "about_fixly", label: "How does Fixly work?" },
  { id: "service_generic", label: "Find a service" },
  { id: "service_generic_available", label: "What services are available?", responseId: "service_generic" },
  { id: "booking_how", label: "How does booking work?" },
  { id: "safety_trust", label: "Is Fixly safe?" },
  { id: "provider_register", label: "How can I become a provider?" },
  { id: "ratings_reviews", label: "How do ratings work?" },
  { id: "cancellation", label: "How can I cancel a booking?" },
  { id: "help_support", label: "How do I contact Fixly?" },
];

/* -----------------------------------------------------------------------
 * PUBLIC API
 * ---------------------------------------------------------------------- */

/**
 * Resolves a response directly by id (used by QUICK_QUESTIONS buttons, or
 * any other place in the UI that already knows which response it wants).
 */
export function getResponseById(id) {
  // Support quick-question entries that point at a different responseId
  // than their own id (e.g. "service_generic_available").
  const quickQuestion = QUICK_QUESTIONS.find((q) => q.id === id);
  const responseId = quickQuestion?.responseId || id;

  const entry = RESPONSES[responseId];
  return buildResponse(entry);
}

/**
 * Main entry point used by the chatbot UI: takes raw free-text user input
 * and returns the best-matching { text, action? } response.
 *
 * Kept synchronous and side-effect free today; can be swapped for an async
 * backend-backed implementation later without changing its signature at
 * the call site (just add `await`).
 */
export function getResponseForText(text) {
  const intent = detectIntent(text);
  const entry = intent ? RESPONSES[intent.responseId] : RESPONSES.fallback;
  return buildResponse(entry);
}