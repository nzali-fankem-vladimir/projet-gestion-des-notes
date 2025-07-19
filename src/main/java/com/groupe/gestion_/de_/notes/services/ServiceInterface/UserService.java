package com.groupe.gestion_.de_.notes.services.ServiceInterface;

import com.groupe.gestion_.de_.notes.dto.*;
import lombok.experimental.SuperBuilder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


public interface UserService {
    public StudentResponse registerStudent(StudentRequest studentRequest);
    public TeacherResponse registerTeacher(TeacherRequest teacherRequest);
    public Optional<UserResponse> findById(Long id);
    public List<UserResponse> getAllUsers();
    public void deleteUserById(Long id);
    public Optional<UserResponse> findByUsername(String username);
    public Optional<UserResponse> findByEmail(String email);
    @Transactional
    UserResponse updateUser(Long id, UserRequest request);
}