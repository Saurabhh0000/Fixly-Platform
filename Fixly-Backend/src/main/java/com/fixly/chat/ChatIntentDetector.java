package com.fixly.chat;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ChatIntentDetector {

    @Autowired
    private ServiceCategoryMatcher categoryMatcher;

    public ChatTopic detectTopic(String rawMessage, String lastIntent) {
        String normalized = ChatTextUtils.normalize(rawMessage);
        if (normalized.isEmpty())
            return ChatTopic.UNKNOWN;

        List<String> tokens = ChatTextUtils.tokenize(normalized);

        for (ChatIntentRule rule : ChatIntentRules.SORTED_RULES) {
            if (ChatTextUtils.containsAny(normalized, tokens, rule.keywords())) {
                return rule.topic();
            }
        }

        // Lightweight follow-up support: a short reply right after a
        // service-search question ("Deep cleaning", "Kitchen tap") that
        // doesn't hit any keyword rule on its own is treated as a
        // continuation of the service search if a matching category exists.
        boolean cameFromServiceSearch = "USER_SERVICE_SEARCH".equals(lastIntent);
        if (cameFromServiceSearch && categoryMatcher.matchCategory(normalized).isPresent()) {
            return ChatTopic.SERVICE_SEARCH;
        }

        return ChatTopic.UNKNOWN;
    }
}