package com.groupe.gestion_.de_.notes.model;

import com.groupe.gestion_.de_.notes.model.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder; // For builder pattern with inheritance

import java.util.List;


@Entity
@Table(name = "users") // Renamed to avoid conflict with 'User' keyword in some DBs
@Inheritance(strategy = InheritanceType.JOINED) // Joined table inheritance strategy
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder // Allows subclasses to use builder from superclass

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstname;

    @Column(nullable = false)
    private String lastname;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING) // Store enum as String in DB
    @Column(nullable = false)
    private Role role; // role: Enum (ADMIN, STUDENT, TEACHER)

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LoginRecord> loginRecords; // one instance of User ca be associated to many instances of loginRecords
}
