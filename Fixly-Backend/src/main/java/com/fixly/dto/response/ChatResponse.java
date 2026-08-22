package com.fixly.dto.response;

import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Backward compatible with the Phase 1 frontend, which only reads
 * { text, action }. `suggestions`, `intent`, and `requiresFollowUp` are
 * additive — Phase 1 UI code ignores fields it doesn't know about.
 */
@Data
@NoArgsConstructor
public class ChatResponse {

    private String text;
    private ChatAction action;
    private List<String> suggestions;
    private String intent;
    private boolean requiresFollowUp;

    public static ChatResponse of(String text) {
        ChatResponse r = new ChatResponse();
        r.setText(text);
        return r;
    }

    public static ChatResponse of(String text, ChatAction action) {
        ChatResponse r = of(text);
        r.setAction(action);
        return r;
    }

    public ChatResponse withIntent(String intent) {
        this.intent = intent;
        return this;
    }

    public ChatResponse withSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
        this.requiresFollowUp = suggestions != null && !suggestions.isEmpty();
        return this;
    }

    public ChatResponse withFollowUp(boolean requiresFollowUp) {
        this.requiresFollowUp = requiresFollowUp;
        return this;
    }
}