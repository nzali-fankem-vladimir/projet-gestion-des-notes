package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.Class; // Renamed to avoid Java keyword conflict
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {
    Optional<Class> findByNameAndAcademicYear(String name, String academicYear);
    List<Class> findByAcademicYear(String academicYear);
}
