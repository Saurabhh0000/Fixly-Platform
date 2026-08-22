package com.fixly.chat;

import java.util.List;
import java.util.Set;

public final class ChatTextUtils {

    private ChatTextUtils() {
    }

    public static String normalize(String text) {
        if (text == null)
            return "";
        return text.toLowerCase()
                .trim()
                .replaceAll("[^a-z0-9\\s]", " ")
                .replaceAll("'", "")
                .replaceAll("\\s+", " ")
                .trim();
    }

    public static List<String> tokenize(String normalized) {
        if (normalized.isEmpty())
            return List.of();
        return List.of(normalized.split(" "));
    }

    private static boolean matches(String normalized, List<String> tokens, String keyword) {
        String k = normalize(keyword);
        if (k.contains(" ")) {
            return normalized.contains(k);
        }
        return tokens.contains(k);
    }

    public static boolean containsAny(String normalized, List<String> tokens, Set<String> keywords) {
        return keywords.stream().anyMatch(k -> matches(normalized, tokens, k));
    }
}