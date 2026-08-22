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

    public User resolveCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResourceNotFoundException("No authenticated Fixly user found");
        }

        String email = auth.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}