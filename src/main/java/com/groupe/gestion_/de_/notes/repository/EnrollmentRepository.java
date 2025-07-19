package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.Enrollment;
import com.groupe.gestion_.de_.notes.model.Student;
import com.groupe.gestion_.de_.notes.model.Subject;
import com.groupe.gestion_.de_.notes.model.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    Optional<Enrollment> findByStudentAndSubjectAndClassEntityAndSemesterAndAcademicYear(
            Student student, Subject subject, Class classEntity, String semester, String academicYear);

    List<Enrollment> findByStudent_Id(Long studentId);
    List<Enrollment> findByClassEntity_Id(Long classId);
    List<Enrollment> findBySubject_Id(Long subjectId);
    List<Enrollment> findByStudent_IdAndSemesterAndAcademicYear(Long studentId, String semester, String academicYear);
}
