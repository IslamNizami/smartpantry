package com.example.smartpantry.model.dto;


import lombok.Data;

import java.util.List;

@Data
public class RecipeDetailDTO {
    private Long id;
    private String title;
    private String image;
    private int readyInMinutes;
    private int healthScore;
    private String instructions;
    private String summary;
    private List<ExtendedIngredient> extendedIngredients;


    @Data
    public static class ExtendedIngredient {
        private String original;
    }

}
