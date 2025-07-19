package com.groupe.gestion_.de_.notes.dto;

import com.groupe.gestion_.de_.notes.model.TranscriptStatus;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranscriptResponse {
    private Long id;
    private LocalDateTime generationDate;
    private TranscriptStatus status;
    private String filepath;
    private StudentResponse student; // Nested StudentResponse DTO
}
