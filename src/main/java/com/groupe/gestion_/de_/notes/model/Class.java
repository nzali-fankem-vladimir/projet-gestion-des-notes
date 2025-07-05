package com.groupe.gestion_.de_.notes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;

@Entity
@Table(name = "classes") // Renamed to avoid conflict with 'Class' keyword in Java
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String academicYear;

    @Column(nullable = false)
    private String name;

    // Relationships
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL) // Renamed 'class' to 'classEntity' to avoid keyword collision
    private List<Enrollment> enrollments; // one instance of ClassEntity can be associated with many instances of Enrollment

    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL)
    private List<ClassSubject> classSubjects; // Many-To-Many relationship with Subject via subjectClass
    // one instance of ClassEntity can be associated with many instances of classSubject

    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL)
    private List<TeacherClass> teacherClasses; // Many-to-many relationship with Teacher via TeacherClass,
    // one instance of ClassEntity can be associated with many instances of teacherClass
}
