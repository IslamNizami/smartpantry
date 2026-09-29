package com.example.smartpantry.model.dto;


import lombok.Data;

import java.util.List;

//A custom object that maps exactly to what spponacular send back (title, image, missing ingredients
@Data
public class RecipeSuggestionDTO {
    private Long id;
    private String title;
    private String image;
    private List<IngredientDTO> usedIngredients;
    private List<IngredientDTO> missedIngredients;

    @Data
    public static class IngredientDTO {
        private String name;
        private String original;
        private String image;
    }
}
