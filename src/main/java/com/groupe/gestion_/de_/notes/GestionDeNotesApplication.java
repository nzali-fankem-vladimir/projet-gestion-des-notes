package com.groupe.gestion_.de_.notes;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "GradeManagement API", version = "3.0", description = "Documentation GradeManagement API v1.0"))
public class GestionDeNotesApplication {

	public static void main(String[] args) {

		SpringApplication.run(GestionDeNotesApplication.class, args);
	}

}
