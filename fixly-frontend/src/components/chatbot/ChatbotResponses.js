/**
 * =============================================================================
 * FIXLY CHATBOT — PHASE 2 BACKEND INTEGRATION
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
 *   - Every message — guest or authenticated, Home/User Dashboard/Provider
 *     Dashboard — goes to POST /api/chat via the app's existing `fixlyApi`
 *     axios instance. /api/chat is public on the backend; the backend
 *     itself resolves the authenticated user (if any) from Spring Security
 *     and decides what a guest is allowed to see. This file does NOT
 *     duplicate that logic and does NOT fall back to local keyword
 *     matching — the backend is the single source of truth.
 *   - fixlyApi's own request interceptor attaches the real auth header
 *     automatically; nothing here touches auth directly.
 *   - `lastIntent` is remembered across calls in this session so short
 *     follow-up replies ("Deep cleaning", "Plumbing") can be understood
 *     by the backend.
 *   - Errors are NOT swallowed here — they propagate up to whatever calls
 *     getResponseForText/getResponseById (FixlyChatbot.jsx), which already
 *     catches them and displays its own ERROR_TEXT. This file's job is
 *     just to call the API and shape the response, not to decide what the
 *     user sees on failure.
 *
 * NOTE ON QUICK QUESTIONS (Phase 3 — account-aware chatbot):
 *   Quick-question `label` text is sent to the backend as the literal
 *   chat message — the backend's ChatIntentDetector matches on that text
 *   the same way it matches anything a person types. `id` only exists to
 *   look the label up locally; the backend never sees the id and doesn't
 *   need to. Labels below were chosen to land cleanly on the intended
 *   ChatIntentRules keyword (see ChatIntentRules.java) rather than being
 *   arbitrary marketing copy.
 * =============================================================================
 */

import fixlyApi from "../../api/fixlyApi";

let lastIntent = null;

async function callChatApi(message) {
  const res = await fixlyApi.post("/api/chat", { message, lastIntent });
  lastIntent = res.data?.intent || null;
  return {
    text: res.data?.text,
    action: res.data?.action || undefined,
    suggestions: res.data?.suggestions || undefined,
  };
}

/* -----------------------------------------------------------------------
 * QUICK QUESTIONS — role-aware. These are UI-only; the backend
 * independently determines the real role from Spring Security for every
 * answer, so this never functions as an authorization mechanism.
 *
 * Kept to 6 per role per Part 28 ("do not overload the UI"). Each label
 * is written to match a specific ChatIntentRules keyword:
 *   - "My latest booking"        -> BOOKING_STATUS ("latest booking")
 *   - "My upcoming bookings"     -> BOOKING_STATUS ("my upcoming bookings")
 *   - "How can I cancel?"        -> BOOKING_CANCEL ("cancel" token)
 *   - "How can I reschedule?"    -> BOOKING_RESCHEDULE ("reschedule" token)
 *   - "My recent reviews"        -> RATING ("my recent reviews")
 *   - "How does booking work?"   -> BOOKING_CREATE ("how does booking work")
 *   - "Pending requests"         -> BOOKING_STATUS ("pending requests")
 *   - "My upcoming jobs"         -> BOOKING_STATUS ("upcoming booking" + "next job")
 *   - "Recent completed jobs"    -> BOOKING_STATUS ("recent completed jobs")
 *   - "How do I manage bookings?"-> BOOKING_QUEUE ("how do i manage bookings")
 * ---------------------------------------------------------------------- */

export const USER_QUICK_QUESTIONS = [
  { id: "user_latest_booking", label: "My latest booking" },
  { id: "user_upcoming_bookings", label: "My upcoming bookings" },
  { id: "user_how_cancel", label: "How can I cancel?" },
  { id: "user_how_reschedule", label: "How can I reschedule?" },
  { id: "user_recent_reviews", label: "My recent reviews" },
  { id: "user_booking_how", label: "How does booking work?" },
];

export const PROVIDER_QUICK_QUESTIONS = [
  { id: "provider_latest_booking", label: "My latest booking" },
  { id: "provider_pending_requests", label: "Pending requests" },
  { id: "provider_upcoming_jobs", label: "My upcoming jobs" },
  { id: "provider_recent_completed", label: "Recent completed jobs" },
  { id: "provider_recent_reviews", label: "Recent reviews" },
  { id: "provider_manage_bookings", label: "How do I manage bookings?" },
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
 * PUBLIC API (async) — both simply call the backend and let errors
 * propagate to the caller.
 * ---------------------------------------------------------------------- */

export async function getResponseById(id) {
  const question = ALL_QUICK_QUESTIONS.find((q) => q.id === id);
  const label = question ? question.label : id;
  return callChatApi(label);
}

export async function getResponseForText(text) {
  return callChatApi(text);
}