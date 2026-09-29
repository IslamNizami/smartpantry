package com.example.smartpantry.model.dto;

import lombok.Data;

import java.util.List;

@Data
public class RecipeSearchResponseDTO {
    private List<RecipeSuggestionDTO> results;
    private Integer offset;
    private Integer number;
    private Integer totalResults;
}