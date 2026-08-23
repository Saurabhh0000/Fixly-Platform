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
 *     follow-up replies ("Deep cleaning") can be understood by the backend.
 *   - Errors are NOT swallowed here — they propagate up to whatever calls
 *     getResponseForText/getResponseById (FixlyChatbot.jsx), which already
 *     catches them and displays its own ERROR_TEXT. This file's job is
 *     just to call the API and shape the response, not to decide what the
 *     user sees on failure.
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