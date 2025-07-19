package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByTeacherIdNum(String teacherIdNum);
}
