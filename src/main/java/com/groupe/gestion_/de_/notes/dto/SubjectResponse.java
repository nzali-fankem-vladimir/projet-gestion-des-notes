package com.groupe.gestion_.de_.notes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SubjectResponse {
    private Long id;
    private String subjectCode;
    private String name;
    private Double coefficient;
    private String description;
}
