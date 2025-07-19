package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GradeUpdateRequest {
    @Min(0)
    private Double value;
    private String comment;
}