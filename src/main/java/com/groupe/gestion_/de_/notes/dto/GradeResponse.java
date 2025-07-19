package com.groupe.gestion_.de_.notes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@SuperBuilder
public class GradeResponse {
    private Long id;
    private Double value;
    private LocalDate date;
    private String comment;
    private Long studentIdNum;
    private String studentName;
    private Long subjectCode;
    private String subjectName;
    private String recordedBy; // Optional, will be null if not set
}