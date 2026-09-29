package com.example.smartpantry.model.dto;

import com.example.smartpantry.model.enums.Category;
import com.example.smartpantry.model.enums.Unit;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PantryItemResponseDTO {
    private Long id;
    private String name;
    private Double quantity;
    private Unit unit;
    private Category category;
    private String expiryStatus; // "EXPIRED", "EXPIRING_SOON", or "FRESH"
}