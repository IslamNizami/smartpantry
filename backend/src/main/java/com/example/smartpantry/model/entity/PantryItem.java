package com.example.smartpantry.model.entity;

import com.example.smartpantry.model.enums.Category;
import com.example.smartpantry.model.enums.Unit;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "pantry_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PantryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true,nullable = false)
    @NotBlank(message = "Name is mandatory")
    private String name;

    @Positive(message = "Quantity must be greater than zero")
    private Double quantity;

    @FutureOrPresent(message = "Expiry date cannot be in the past")
    private LocalDate expiryDate;


    @Enumerated(EnumType.STRING)
    private Unit unit;


    @Enumerated(EnumType.STRING)
    @NotNull
    private Category category;


}
