package com.fixly.chat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.fixly.entity.User;
import com.fixly.exception.ResourceNotFoundException;
import com.fixly.repository.UserRepository;

/**
 * The ONLY place chat code resolves "who is asking". Always derives identity
 * from the authenticated Spring Security context (email == username, set by
 * CustomUserDetailsService) — never from any client-supplied ID.
 */
@Component
public class AuthenticatedUserResolver {

    @Autowired
    private UserRepository userRepository;

    /**
     * Throws if there's no valid authenticated Fixly user. Use only for code
     * paths that genuinely require authentication and should fail loudly if
     * it's missing.
     */
    public User resolveCurrentUser() {
        User user = resolveCurrentUserOrNull();
        if (user == null) {
            throw new ResourceNotFoundException("No authenticated Fixly user found");
        }
        return user;
    }

    /**
     * Returns the authenticated Fixly user, or null if the request is
     * unauthenticated (a guest). Never throws for the "not logged in" case —
     * this is what /api/chat uses, since it must work for both guests
     * (public questions) and authenticated users (account-specific answers).
     */
    public User resolveCurrentUserOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }

        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }
}