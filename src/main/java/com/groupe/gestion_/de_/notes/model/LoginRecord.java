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
    private Long id;

    @Column(nullable = false)
    private LocalDateTime logIn;

    private LocalDateTime logOut;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY) // Many login records belong to one user
    @JoinColumn(name = "user_id", nullable = false) // Foreign key to User entity
    private User user;
}
