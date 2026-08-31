package com.fixly.config;

import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        // 🔐 Password Encoder
        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public WebSecurityCustomizer webSecurityCustomizer() {

                return (web) -> web.ignoring()
                                .requestMatchers("/uploads/**");
        }

        // 🔐 Authentication Manager
        @Bean
        public AuthenticationManager authenticationManager(
                        AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        // 🔐 Security Rules
        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

                http
                                .cors(withDefaults())
                                .csrf(csrf -> csrf.disable())

                                .authorizeHttpRequests(auth -> auth

                                                /* ================= PUBLIC ================= */
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers("/actuator/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/addresses/**").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/providers/search").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()
                                                .requestMatchers(
                                                                HttpMethod.GET,
                                                                "/uploads/**")
                                                .permitAll()

                                                .requestMatchers("/api/chat").permitAll()

                                                /* ================= AUTHENTICATED (ALL ROLES) ================= */

                                                .requestMatchers("/api/users/change-password", "/api/notifications/**")
                                                .authenticated()

                                                /* ================= USER ================= */
                                                .requestMatchers(
                                                                "/api/dashboard/user",
                                                                "/api/bookings/user/**",
                                                                "/api/providers/register")
                                                .hasRole("USER")

                                                /* ================= USER + PROVIDER ================= */

                                                .requestMatchers(
                                                                "/api/providers/status/**")
                                                .hasAnyRole(
                                                                "USER",
                                                                "PROVIDER")

                                                /* ================= PROVIDER ================= */
                                                .requestMatchers(
                                                                "/api/dashboard/provider",
                                                                "/api/bookings/provider/**",
                                                                "/api/providers/*/availability")
                                                .hasRole("PROVIDER")

                                                /* ================= ADMIN ================= */
                                                /* ================= ADMIN ================= */
                                                .requestMatchers("/api/categories/**", "/api/admin/providers/**",
                                                                "/api/admin/analytics/**")
                                                .hasRole("ADMIN")

                                                /* ================= PREFLIGHT ================= */
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                                                .anyRequest().authenticated())
                                .httpBasic(httpBasic -> httpBasic
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        response.setStatus(401);
                                                        response.setContentType("application/json");
                                                        response.getWriter().write("""
                                                                            {
                                                                              "error": "UNAUTHORIZED",
                                                                              "message": "Authentication required"
                                                                            }
                                                                        """);
                                                }));

                return http.build();
        }
}