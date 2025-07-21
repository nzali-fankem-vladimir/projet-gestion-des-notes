package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.dto.*;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/users")
@Tag(name = "Grade Management API", description = " application endpoints !")
public class UserController {

    private final UserService userService; // Inject UserService

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation ( summary = "endpoint for registering a new studentuser!")
    @PostMapping("/students") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can register a student
    public ResponseEntity<UserResponse> registerStudent(@Valid @RequestBody StudentRequest request) {
        UserResponse response = userService.registerStudent(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation ( summary = "endpoint for registering a new teacheruser!")
    @PostMapping("/teachers") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can register a teacher
    public ResponseEntity<UserResponse> registerTeacher(@Valid @RequestBody TeacherRequest request) {
        UserResponse response = userService.registerTeacher(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation ( summary = "endpoint to perform an Id search!")
    @GetMapping("/{id}") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can make researches on users
    public ResponseEntity<Optional<UserResponse>> findById(@Valid @PathVariable Long id){
        Optional<UserResponse> optionalresponse = userService.findById(id);
        if(optionalresponse.isPresent()){
            optionalresponse.get();
            return new ResponseEntity<>(optionalresponse, HttpStatus.FOUND);
        }else {
            return new ResponseEntity<>(optionalresponse,HttpStatus.NOT_FOUND);
        }
    }

    @Operation ( summary = "endpoint to perform a search base on Username!")
    @GetMapping("/username/{username}") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can make researches on users
    public ResponseEntity<Optional<UserResponse>> findByUsername(@Valid @PathVariable String username){
        Optional<UserResponse> optionalresponse = userService.findByUsername(username);
        if(optionalresponse.isPresent()){
            optionalresponse.get();
            return new ResponseEntity<>(optionalresponse, HttpStatus.FOUND);
        }else {
            return new ResponseEntity<>(optionalresponse, HttpStatus.NOT_FOUND);
        }
    }

    @Operation ( summary = "endpoint to perform a search base on Email!")
    @GetMapping("/email/{email}") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can make researches on users
    public ResponseEntity<Optional<UserResponse>> findByEmail(@Valid @PathVariable String email){
        Optional<UserResponse> optionalresponse = userService.findByEmail(email);
        if(optionalresponse.isPresent()){
            optionalresponse.get();
            return new ResponseEntity<>(optionalresponse,HttpStatus.FOUND);
        }else{
            return new ResponseEntity<>(optionalresponse, HttpStatus.NOT_FOUND);
        }
    }

    @Operation ( summary = "endpoint to get all users!")
    @GetMapping("/users") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can make researches on users
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        List<UserResponse> listuser = userService.getAllUsers();
        return new ResponseEntity<>(listuser, HttpStatus.FOUND);
    }


    @Operation ( summary = "endpoint to perform an update on user data!")
    @PutMapping("/update/{id}") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can update user's information
    public ResponseEntity<UserResponse> updateUser(@Valid @PathVariable Long id, @RequestBody UserRequest request){
        UserResponse userupdated = userService.updateUser(id, request);
        return new ResponseEntity<>(userupdated, HttpStatus.OK);
    }

    @Operation ( summary = "endpoint to perform a delete!")
    @DeleteMapping("/delete/{id}") // Simpler URL
    @PreAuthorize("hasRole('ADMIN')") // ONLY ADMIN can make researches on users
    public ResponseEntity<Void> deleteUserById(@Valid @PathVariable Long id){
        userService.deleteUserById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}