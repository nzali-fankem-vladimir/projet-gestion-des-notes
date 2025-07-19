package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Basic CRUD operations are inherited
}
