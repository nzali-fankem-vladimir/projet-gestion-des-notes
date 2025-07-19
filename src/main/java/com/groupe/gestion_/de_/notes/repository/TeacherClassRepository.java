package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.TeacherClass;
import com.groupe.gestion_.de_.notes.model.Teacher;
import com.groupe.gestion_.de_.notes.model.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherClassRepository extends JpaRepository<TeacherClass, Long> {
    Optional<TeacherClass> findByTeacherAndClassEntity(Teacher teacher, Class classEntity);
    List<TeacherClass> findByTeacher_Id(Long teacherId);
    List<TeacherClass> findByClassEntity_Id(Long classId);
}
