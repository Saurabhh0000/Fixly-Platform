package com.fixly.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fixly.entity.User;
import com.fixly.enums.Role;
import com.fixly.repository.UserRepository;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@fixly.com";

            boolean adminExists = userRepository.existsByEmail(adminEmail);

            if (!adminExists) {
                User admin = new User();
                admin.setFullName("Fixly Admin");
                admin.setEmail(adminEmail);
                admin.setPhone("9999999999");
                admin.setRole(Role.ADMIN);
                admin.setActive(true);
                admin.setPassword(passwordEncoder.encode("Admin@123"));

                userRepository.save(admin);

                System.out.println("✅ Admin created on startup");
            } else {
                System.out.println("ℹ️ Admin already exists, skipping creation");
            }
        };
    }
}
