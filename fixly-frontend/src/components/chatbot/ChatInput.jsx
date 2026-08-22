import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

/* ══════════════════════════════════════════
   CHAT INPUT — pinned to the bottom of the
   chatbot panel. Enter or the send button
   submits the current text. `disabled` is set
   while a response is in flight, to prevent
   duplicate submissions.
══════════════════════════════════════════ */
const ChatInput = ({ onSend, disabled = false }) => {
  const [value, setValue] = useState("");

  const submit = () => {
    if (disabled) return;
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="fixly-chatbot-input-row">
      <label htmlFor="fixly-chatbot-input" className="fixly-chatbot-sr-only">
        Ask Fixly Assistant
      </label>
      <input
        id="fixly-chatbot-input"
        type="text"
        className="fixly-chatbot-input"
        placeholder={
          disabled ? "Fixly Assistant is thinking…" : "Ask Fixly Assistant..."
        }
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        disabled={disabled}
      />
      <button
        type="button"
        className="fixly-chatbot-send-btn"
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label="Send message">
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default ChatInput;
