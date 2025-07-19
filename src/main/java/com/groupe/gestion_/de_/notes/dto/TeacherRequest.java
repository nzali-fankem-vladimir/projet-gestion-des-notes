package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true) // Important for Lombok to include superclass fields in equals/hashCode
public class TeacherRequest extends UserRequest {
    @NotBlank(message = "Teacher ID number cannot be blank")
    @Pattern(regexp = "^T\\d{4}$", message = "Teacher ID must start with 'T' followed by 4 digits (e.g., T1234)")
    private String teacherIdNum;
}