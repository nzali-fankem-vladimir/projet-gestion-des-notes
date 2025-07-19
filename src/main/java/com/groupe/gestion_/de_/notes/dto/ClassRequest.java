package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClassRequest {
    @NotBlank
    private String academicYear;
    @NotBlank
    private String name;
}
