package com.example.smartpantry.model.dto;


import com.example.smartpantry.model.enums.Category;
import com.example.smartpantry.model.enums.Unit;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PantryItemRequestDTO {

    @NotBlank(message = "Hey! You forgot to give the item a name.")
    @Size(max = 100,message = "Name is too long!")
    private String name;

    @Positive(message = "Nice try, but quantity must be a positive number!")
    private Double quantity;

    @FutureOrPresent(message = "The expiry date must be today or in the future.")
    private LocalDate expiryDate;

    private Category category;
    private Unit unit;
}
