package com.groupe.gestion_.de_.notes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "teachers") // Specific table for Teacher data
@PrimaryKeyJoinColumn(name = "user_id") // Links teacher table to user table using user_id as FK
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Teacher extends User {
    @Column(unique = true, nullable = false)
    private String teacherIdNum; // teacherIdNum: String

    // Relationships
    @OneToMany(mappedBy = "teacher", cascade = CascadeType.ALL)
    private List<TeacherClass> teacherClasses; // 1..* TeacherClass to 1 Teacher

    // Optional: If you decide to link Grades to Teacher directly
    @OneToMany(mappedBy = "recordedByTeacher")
    private List<Grade> recordedGrades;
}
