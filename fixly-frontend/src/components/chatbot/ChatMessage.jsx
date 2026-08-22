import { FaRobot } from "react-icons/fa";

/* ══════════════════════════════════════════
   CHAT MESSAGE — one bubble in the conversation.
   User messages align right (green); assistant
   messages align left (light green) with a small
   robot avatar. An optional action button can
   accompany an assistant message (e.g. "Browse
   Services"), and optional suggestion chips let
   the person tap a quick reply instead of typing
   (e.g. clarifying follow-up options from Support).
══════════════════════════════════════════ */
const ChatMessage = ({ message, onAction, onSuggestionClick }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`fixly-chatbot-msg-row ${
        isUser ? "fixly-chatbot-msg-row-user" : "fixly-chatbot-msg-row-bot"
      }`}>
      {!isUser && (
        <div className="fixly-chatbot-msg-avatar" aria-hidden="true">
          <FaRobot />
        </div>
      )}

      <div className="fixly-chatbot-msg-col">
        <div
          className={`fixly-chatbot-bubble ${
            isUser ? "fixly-chatbot-bubble-user" : "fixly-chatbot-bubble-bot"
          }`}>
          {message.text}
        </div>

        {message.action && (
          <button
            type="button"
            className="fixly-chatbot-action-btn"
            onClick={() => onAction(message.action)}>
            {message.action.label}
          </button>
        )}

        {!isUser && message.suggestions && message.suggestions.length > 0 && (
          <div className="fixly-chatbot-quick-row" style={{ paddingLeft: 0 }}>
            {message.suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="fixly-chatbot-quick-btn"
                onClick={() => onSuggestionClick?.(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
