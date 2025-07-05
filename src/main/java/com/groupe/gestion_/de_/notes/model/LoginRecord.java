package com.groupe.gestion_.de_.notes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id: Long (PK)

    @Column(nullable = false)
    private LocalDateTime logIn; // log_in: DateTime

    private LocalDateTime logOut; // log_out: DateTime (nullable)

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY) // Many login records belong to one user
    @JoinColumn(name = "user_id", nullable = false) // Foreign key to User entity
    private User user; // 1 Login_records to 1..* User
}
