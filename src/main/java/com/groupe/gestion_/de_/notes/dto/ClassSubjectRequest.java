package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class ClassSubjectRequest {
    @NotNull(message = "Class ID cannot be null")
    @Positive(message = "Class ID must be positive")
    private Long classId;

    @NotNull(message = "Subject ID cannot be null")
    @Positive(message = "Subject ID must be positive")
    private Long subjectId;
}
