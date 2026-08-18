import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

/* ══════════════════════════════════════════
   CHAT INPUT — pinned to the bottom of the
   chatbot panel. Enter or the send button
   submits the current text.
══════════════════════════════════════════ */
const ChatInput = ({ onSend }) => {
  const [value, setValue] = useState("");

  const submit = () => {
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
        placeholder="Ask Fixly Assistant..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      <button
        type="button"
        className="fixly-chatbot-send-btn"
        onClick={submit}
        disabled={!value.trim()}
        aria-label="Send message">
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default ChatInput;
