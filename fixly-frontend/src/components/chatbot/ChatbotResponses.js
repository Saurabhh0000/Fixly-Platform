/* ============================================================
   FIXLY ASSISTANT — response handling (Phase 1: keyword-based)
   ============================================================
   This module is intentionally the ONLY place that decides what
   the assistant says. FixlyChatbot.jsx never inspects keywords
   or response text directly — it just calls getResponseById /
   getResponseForText and renders whatever { text, action } comes
   back. That means Phase 2 (a real backend) only requires
   changing the two functions below, e.g.:

     export async function getResponseForText(text) {
       const res = await fixlyApi.post("/api/chat", { message: text });
       return res.data; // must resolve to { text, action? }
     }

   ...and making the caller in FixlyChatbot.jsx `await` it. No
   component or CSS changes would be needed.
   ============================================================ */

export const QUICK_QUESTIONS = [
  { id: "how-it-works", label: "How does Fixly work?" },
  { id: "find-service", label: "Find a service" },
  { id: "become-provider", label: "How can I become a provider?" },
  { id: "booking-works", label: "How does booking work?" },
  { id: "is-safe", label: "Is Fixly safe?" },
  { id: "contact", label: "Contact Fixly" },
];

const RESPONSES = {
  "how-it-works": {
    text: "Fixly connects customers with service professionals. You can explore available services, choose a provider, select your address and service date, and place a booking.",
  },
  "find-service": {
    text: "Looking for a professional? You can browse Fixly's available service categories and find providers based on the service you need.",
    action: { label: "Browse Services", to: "/search" },
  },
  "become-provider": {
    text: "You can join Fixly as a service provider by registering through the Become a Provider section. You'll need to provide your service and verification details.",
    action: { label: "Become a Provider", to: "/become-provider" },
  },
  "booking-works": {
    text: "Choose a service provider, select your address and service date, and confirm your booking. Once the provider accepts your request, you'll receive a service verification OTP.",
  },
  "is-safe": {
    text: "Fixly is designed to connect users with service professionals while providing verification, booking management, OTP-based service completion, ratings and reviews.",
  },
  contact: {
    text: "If you need additional help, please use the Help & Support section.",
    action: { label: "Help & Support", to: "/help-support" },
  },
};

const FALLBACK = {
  text: "Sorry, I don't have an answer for that yet. You can explore our services or visit Help & Support for assistance.",
};

/* keyword → predefined response id, checked in order */
const KEYWORD_RULES = [
  {
    id: "find-service",
    keywords: ["plumber", "plumbing", "electrician", "cleaning"],
  },
  {
    id: "become-provider",
    keywords: ["provider", "join", "work"],
  },
  {
    id: "booking-works",
    keywords: ["booking"],
  },
];

/** Look up a response by quick-question / rule id. */
export function getResponseById(id) {
  return RESPONSES[id] || FALLBACK;
}

/** Resolve free-text input to a predefined response via keyword match. */
export function getResponseForText(text) {
  const normalized = text.toLowerCase();
  const rule = KEYWORD_RULES.find((r) =>
    r.keywords.some((k) => normalized.includes(k)),
  );
  return rule ? RESPONSES[rule.id] : FALLBACK;
}