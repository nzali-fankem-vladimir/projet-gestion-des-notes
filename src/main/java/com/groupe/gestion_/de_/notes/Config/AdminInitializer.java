package com.groupe.gestion_.de_.notes.Config;

import com.groupe.gestion_.de_.notes.model.Role;
import com.groupe.gestion_.de_.notes.model.User;
import com.groupe.gestion_.de_.notes.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsername; // Inject from properties or env
    private final String adminPassword;
    private final String adminEmail;

    // Constructor to inject dependencies and properties
    public AdminInitializer(UserRepository userRepository,
                            PasswordEncoder passwordEncoder,
                            @Value("${app.admin.username:admin}") String adminUsername, // Default to 'admin'
                            @Value("${app.admin.password:adminpass}") String adminPassword, // Default for dev
                            @Value("${app.admin.email:admin@example.com}") String adminEmail) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
        this.adminEmail = adminEmail;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if an admin user already exists using Optional
        Optional<User> adminOptional = userRepository.findByRole(Role.ADMIN);

        if (adminOptional.isEmpty()) {
            System.out.println("No ADMIN user found. Creating initial admin...");

            User newAdmin = User.builder()
                    .username(adminUsername)
                    .password(passwordEncoder.encode(adminPassword))
                    .firstname("Super")
                    .lastname("Admin")
                    .email(adminEmail)
                    .role(Role.ADMIN)
                    .build();

            userRepository.save(newAdmin);
            System.out.println("Initial ADMIN user created successfully!");
        } else {
            System.out.println("ADMIN user already exists. Skipping initial admin creation.");
        }
    }
}
