package com.fixly.chat;

import java.util.Set;

public record ChatIntentRule(ChatTopic topic, int priority, Set<String> keywords) {
}