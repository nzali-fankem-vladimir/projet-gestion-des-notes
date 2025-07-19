package com.groupe.gestion_.de_.notes.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST) // This makes Spring respond with a 400 status code
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}