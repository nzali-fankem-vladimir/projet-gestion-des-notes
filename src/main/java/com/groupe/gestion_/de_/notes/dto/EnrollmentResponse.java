package com.groupe.gestion_.de_.notes.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentResponse {
    private Long id;
    private LocalDate enrollmentDate;
    private String semester;
    private String academicYear;
    private StudentResponse student; // Nested StudentResponse DTO
    private SubjectResponse subject; // Nested SubjectResponse DTO
    private ClassResponse classEntity; // Nested ClassResponse DTO
}