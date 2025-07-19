package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GradeRequest {
    @NotNull
    private Long studentIdNum;
    @NotNull
    private Long subjectCode;
    @NotNull @Min(0)
    private Double value;
    private String comment;
}
