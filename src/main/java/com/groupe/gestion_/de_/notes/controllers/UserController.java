package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.dto.*;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Grade Management API", description = " application endpoints !")
public class UserController {

    private final UserService userService; // Inject UserService

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation ( summary = "endpoint for registering a new studentuser!")
    @PostMapping("/students") // Simpler URL
    public ResponseEntity<UserResponse> registerStudent(@Valid @RequestBody StudentRequest request) {
        UserResponse response = userService.registerStudent(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation ( summary = "endpoint for registering a new teacheruser!")
    @PostMapping("/teachers") // Simpler URL
    public ResponseEntity<UserResponse> registerTeacher(@Valid @RequestBody TeacherRequest request) {
        UserResponse response = userService.registerTeacher(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

}