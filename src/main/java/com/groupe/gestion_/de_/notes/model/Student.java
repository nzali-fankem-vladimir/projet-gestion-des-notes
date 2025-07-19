package com.groupe.gestion_.de_.notes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.boot.autoconfigure.elasticsearch.ElasticsearchConnectionDetails;

import java.util.List;

@Entity
@Table(name = "students") // Specific table for Student data
@PrimaryKeyJoinColumn(name = "user_id") // Links student table to user table using user_id as FK
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Student extends User {
    @Column(unique = true, nullable = false)
    private String studentIdNum;

    // Relationships
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Enrollment> enrollments; // one instance of student can be associated to many instances of enrollment

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Grade> grades; // one instance of student can be associated to many instances of grades

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Transcript> transcripts; // one instance of student can be associated to many instances of Transcripts


}
