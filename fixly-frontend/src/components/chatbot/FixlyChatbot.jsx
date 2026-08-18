import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaTimes } from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import {
  QUICK_QUESTIONS,
  getResponseById,
  getResponseForText,
} from "./ChatbotResponses";
import "../../styles/fixly-chatbot.css";

let idCounter = 0;
const nextId = () => `fixly-chatbot-msg-${Date.now()}-${idCounter++}`;

const WELCOME_TEXT =
  "Hi! 👋 I'm Fixly Assistant.\n\nI can help you find services, understand how Fixly works, or guide you through booking a service.";

/* ══════════════════════════════════════════
   FIXLY CHATBOT — floating assistant widget.
   Self-contained: safe to drop into any page
   with <FixlyChatbot /> and nothing else.
══════════════════════════════════════════ */
const FixlyChatbot = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  /* seed the welcome message the first time the panel opens */
  useEffect(() => {
    if (open && !hasOpenedOnce) {
      setMessages([{ id: nextId(), sender: "bot", text: WELCOME_TEXT }]);
      setHasOpenedOnce(true);
    }
  }, [open, hasOpenedOnce]);

  /* keep the message list scrolled to the newest message */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const pushMessage = (msg) => {
    setMessages((prev) => [...prev, { id: nextId(), ...msg }]);
  };

  const respond = (response) => {
    pushMessage({
      sender: "bot",
      text: response.text,
      action: response.action,
    });
  };

  const handleQuickQuestion = (question) => {
    pushMessage({ sender: "user", text: question.label });
    respond(getResponseById(question.id));
  };

  const handleUserSend = (text) => {
    pushMessage({ sender: "user", text });
    respond(getResponseForText(text));
  };

  const handleAction = (action) => {
    if (action?.to) navigate(action.to);
  };

  /* quick-question pills only show right after the welcome message,
     before the person has started a real conversation */
  const showQuickQuestions = messages.length <= 1;

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
                  Your service booking assistant
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
              <ChatMessage key={m.id} message={m} onAction={handleAction} />
            ))}

            {showQuickQuestions && (
              <div className="fixly-chatbot-quick-row">
                {QUICK_QUESTIONS.map((q) => (
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
          <ChatInput onSend={handleUserSend} />
        </div>
      )}

      {/* ── TOGGLE BUTTON ── */}
      <button
        type="button"
        className="fixly-chatbot-toggle-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Fixly Assistant" : "Open Fixly Assistant"}>
        <FaRobot />
      </button>
    </div>
  );
};

export default FixlyChatbot;
