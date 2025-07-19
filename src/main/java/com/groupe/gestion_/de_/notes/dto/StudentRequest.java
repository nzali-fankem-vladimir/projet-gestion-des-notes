package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true) // Important for Lombok to include superclass fields in equals/hashCode
public class StudentRequest extends UserRequest {
    @NotBlank(message = "Student ID number cannot be blank")
    @Pattern(regexp = "^S\\d{4}$", message = "Student ID must start with 'S' followed by 4 digits (e.g., S1234)")
    private String studentIdNum;
}
