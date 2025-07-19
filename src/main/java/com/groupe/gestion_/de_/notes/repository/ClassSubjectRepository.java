package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.ClassSubject;
import com.groupe.gestion_.de_.notes.model.Class;
import com.groupe.gestion_.de_.notes.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassSubjectRepository extends JpaRepository<ClassSubject, Long> {
    Optional<ClassSubject> findByClassEntityAndSubject(Class classEntity, Subject subject);
    List<ClassSubject> findByClassEntity_Id(Long classId);
    List<ClassSubject> findBySubject_Id(Long subjectId);
}