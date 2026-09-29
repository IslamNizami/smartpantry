package com.example.smartpantry.controller;


import com.example.smartpantry.model.dto.RecipeDetailDTO;
import com.example.smartpantry.model.dto.RecipeSuggestionDTO;
import com.example.smartpantry.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** GET /api/recipes/suggest  (the trigger that talks to spooncaular
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    @GetMapping("/suggest")
    public List<RecipeSuggestionDTO> getSuggestions(@RequestParam(defaultValue = "6") int limit, @RequestParam(defaultValue = "0") int offset){
        return recipeService.getSuggestions(limit,offset);
    }

    @GetMapping("/search")
    public List<RecipeSuggestionDTO> searchRecipes(@RequestParam String query,@RequestParam(defaultValue = "6") int limit, @RequestParam(defaultValue = "0") int offset){
        return recipeService.searchByQuery(query,limit,offset);
    }

    @GetMapping("/{id}/information")
    public ResponseEntity<RecipeDetailDTO> getInformation(@PathVariable Long id){
        return ResponseEntity.ok(recipeService.getRecipeDetails(id));

    }
}
