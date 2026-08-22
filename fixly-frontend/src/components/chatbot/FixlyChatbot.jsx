import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaTimes } from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {
  USER_QUICK_QUESTIONS,
  PROVIDER_QUICK_QUESTIONS,
  getResponseById,
  getResponseForText,
} from "./ChatbotResponses";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/fixly-chatbot.css";

let idCounter = 0;
const nextId = () => `fixly-chatbot-msg-${Date.now()}-${idCounter++}`;

const USER_WELCOME_TEXT =
  "Hi! 👋 I'm Fixly Assistant.\n\nI can help you find services, understand how Fixly works, or guide you through booking a service.";

const PROVIDER_WELCOME_TEXT =
  "Hi! 👋 I'm Fixly Assistant.\n\nI can help you with bookings, verification, availability, customer requests, service completion, ratings and more.";

const ERROR_TEXT =
  "I'm unable to answer that right now. Please try again in a moment, or use Help & Support if this keeps happening.";

/* ══════════════════════════════════════════
   FIXLY CHATBOT — floating assistant widget.
   Self-contained: safe to drop into any page
   with <FixlyChatbot /> and nothing else.

   Role-aware: reads AuthContext to decide which
   welcome text and quick-question set to show.
     - No user (guest, e.g. Home page)  -> USER set
     - user.role === "PROVIDER"          -> PROVIDER set
     - user.role === "USER" (or other)   -> USER set
   This is presentation-only — the backend independently
   determines the real role server-side for every answer,
   so this never functions as an authorization mechanism.
══════════════════════════════════════════ */
const FixlyChatbot = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const isProvider = auth?.user?.role === "PROVIDER";

  const quickQuestions = isProvider
    ? PROVIDER_QUICK_QUESTIONS
    : USER_QUICK_QUESTIONS;
  const welcomeText = isProvider ? PROVIDER_WELCOME_TEXT : USER_WELCOME_TEXT;

  const [open, setOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef(null);

  /* seed the welcome message the first time the panel opens */
  useEffect(() => {
    if (open && !hasOpenedOnce) {
      setMessages([{ id: nextId(), sender: "bot", text: welcomeText }]);
      setHasOpenedOnce(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hasOpenedOnce]);

  /* keep the message list scrolled to the newest message */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, isThinking]);

  const pushMessage = (msg) => {
    setMessages((prev) => [...prev, { id: nextId(), ...msg }]);
  };

  const respond = (response) => {
    pushMessage({
      sender: "bot",
      text: response.text,
      action: response.action,
      suggestions: response.suggestions,
    });
  };

  /* shared by quick questions, typed messages, and suggestion chips —
     always goes through the same async path with the same loading /
     error handling, and guards against double-submits while a reply
     is in flight. */
  const sendToAssistant = async (fetchResponse) => {
    if (isThinking) return;
    setIsThinking(true);
    try {
      const response = await fetchResponse();
      respond(response);
    } catch {
      respond({ text: ERROR_TEXT });
    } finally {
      setIsThinking(false);
    }
  };

  const handleQuickQuestion = (question) => {
    pushMessage({ sender: "user", text: question.label });
    sendToAssistant(() => getResponseById(question.id));
  };

  const handleUserSend = (text) => {
    pushMessage({ sender: "user", text });
    sendToAssistant(() => getResponseForText(text));
  };

  const handleSuggestionClick = (suggestionText) => {
    handleUserSend(suggestionText);
  };

  const handleAction = (action) => {
    if (action?.to) navigate(action.to);
  };

  /* quick-question pills only show right after the welcome message,
     before the person has started a real conversation */
  const showQuickQuestions = messages.length <= 1 && !isThinking;

  return (
    <div className="fixly-chatbot-root">
      {open && (
        <div
          className="fixly-chatbot-panel"
          role="dialog"
          aria-label="Fixly Assistant">
          {/* ── HEADER ── */}
          <div className="fixly-chatbot-header">
            <div className="fixly-chatbot-header-left">
              <div className="fixly-chatbot-header-icon" aria-hidden="true">
                <FaRobot />
              </div>
              <div className="fixly-chatbot-header-text">
                <span className="fixly-chatbot-header-title">
                  Fixly Assistant
                </span>
                <span className="fixly-chatbot-header-sub">
                  {isProvider
                    ? "Your provider support assistant"
                    : "Your service booking assistant"}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="fixly-chatbot-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Close Fixly Assistant">
              <FaTimes />
            </button>
          </div>

          {/* ── MESSAGES ── */}
          <div
            className="fixly-chatbot-messages"
            ref={scrollRef}
            aria-live="polite">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                message={m}
                onAction={handleAction}
                onSuggestionClick={handleSuggestionClick}
              />
            ))}

            {isThinking && (
              <div className="fixly-chatbot-msg-row fixly-chatbot-msg-row-bot">
                <div className="fixly-chatbot-msg-avatar" aria-hidden="true">
                  <FaRobot />
                </div>
                <div className="fixly-chatbot-bubble fixly-chatbot-bubble-bot">
                  Fixly Assistant is thinking…
                </div>
              </div>
            )}

            {showQuickQuestions && (
              <div className="fixly-chatbot-quick-row">
                {quickQuestions.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    className="fixly-chatbot-quick-btn"
                    onClick={() => handleQuickQuestion(q)}>
                    {q.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── INPUT ── */}
          <ChatInput onSend={handleUserSend} disabled={isThinking} />
        </div>
      )}

      {/* ── TOGGLE BUTTON ── */}
      <button
        type="button"
        className="fixly-chatbot-toggle-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Fixly Assistant" : "Open Fixly Assistant"}
        aria-expanded={open}>
        <FaRobot />
      </button>
    </div>
  );
};

export default FixlyChatbot;
