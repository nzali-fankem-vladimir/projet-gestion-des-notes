package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.Grade;
import com.groupe.gestion_.de_.notes.model.Student;
import com.groupe.gestion_.de_.notes.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudent_Id(Long studentId);
    List<Grade> findBySubject_Id(Long subjectId);
    List<Grade> findByStudent_IdAndSubject_Id(Long studentId, Long subjectId);
    Optional<Grade> findByStudentAndSubjectAndDate(Student student, Subject subject, LocalDate date);
    List<Grade> findByRecordedByTeacher_Id(Long teacherId); // If you decide to track the teacher who recorded the grade
}