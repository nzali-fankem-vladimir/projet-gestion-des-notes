package com.groupe.gestion_.de_.notes.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "admins") // Specific table for Admin data
@PrimaryKeyJoinColumn(name = "user_id") // Links admin table to user table using user_id as FK
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Admin extends User {
    // No unique attributes for Admin shown in diagram
    // If Admin had any specific attributes (e.g., department), they would go here.
}
