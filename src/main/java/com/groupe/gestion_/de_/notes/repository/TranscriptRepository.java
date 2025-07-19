package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.Transcript;
import com.groupe.gestion_.de_.notes.model.Student;
import com.groupe.gestion_.de_.notes.model.TranscriptStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TranscriptRepository extends JpaRepository<Transcript, Long> {
    List<Transcript> findByStudent_Id(Long studentId);
    List<Transcript> findByStatus(TranscriptStatus status);
    Optional<Transcript> findByStudentAndFilepath(Student student, String filepath);
}
