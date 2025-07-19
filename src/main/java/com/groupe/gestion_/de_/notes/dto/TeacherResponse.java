package com.groupe.gestion_.de_.notes.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class TeacherResponse extends UserResponse {
    private String teacherIdNum;
}
