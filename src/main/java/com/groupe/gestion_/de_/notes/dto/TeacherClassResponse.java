package com.groupe.gestion_.de_.notes.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherClassResponse {
    private Long id;
    private TeacherResponse teacher; // Nested DTO for teacher details
    private ClassResponse classEntity; // Nested DTO for class details
}
