package com.groupe.gestion_.de_.notes.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRecordResponse {
    private Long id;
    private LocalDateTime logIn;
    private LocalDateTime logOut;
    private UserResponse user; // Nested UserResponse DTO for user details
}