package com.groupe.gestion_.de_.notes.model;

import com.groupe.gestion_.de_.notes.model.TranscriptStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime; // generation_date likely includes time

@Entity
@Table(name = "transcripts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transcript {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id: Long (PK)

    @Column(nullable = false)
    private LocalDateTime generationDate; // generation_date: DateTime

    @Enumerated(EnumType.STRING) // Store enum as String in DB
    @Column(nullable = false)
    private TranscriptStatus status; // status: Enum (GENERATED, ARCHIVED, ERROR)

    @Column(nullable = false)
    private String filepath; // filepath: String

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false) // 1 Transcript to 1..* Student
    private Student student;
}
