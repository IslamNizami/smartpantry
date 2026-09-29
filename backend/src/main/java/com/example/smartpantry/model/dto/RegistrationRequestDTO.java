package com.example.smartpantry.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistrationRequestDTO {

    @Email
    private String email;

    @Size(min = 8, max = 16, message = "Password must be 8-16 characters")
    private String password;


}
