package com.example.smartpantry.service;


import com.example.smartpantry.model.dto.RecipeDetailDTO;
import com.example.smartpantry.model.dto.RecipeSearchResponseDTO;
import com.example.smartpantry.model.dto.RecipeSuggestionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

/** This service will call the Spoonacular API.
 *  It takes list of ingredients from PantryService and
 *  asks the external api for matches
 * */
@Service
@RequiredArgsConstructor
public class RecipeService {

    private final PantryService pantryService;
    private final RestTemplate restTemplate;

    @Value("${spoonacular.api.key}")
    private String apiKey;

    @Value("${spoonacular.api.url}")
    private String apiUrl;

    public List<RecipeSuggestionDTO> getSuggestions(int limit, int offset) {
        String ingredients = pantryService.getIngredientListForApi();
        if (ingredients.isEmpty()) return List.of();

        int numberToFetch = limit + offset;

        String url = String.format("%s?ingredients=%s&number=%d&ranking=1&apiKey=%s",
                apiUrl, ingredients, numberToFetch, apiKey);

        RecipeSuggestionDTO[] response = restTemplate.getForObject(url, RecipeSuggestionDTO[].class);

        if (response == null || response.length == 0) return List.of();

        List<RecipeSuggestionDTO> allRecipes = Arrays.asList(response);

        if (offset >= allRecipes.size()) {
            return List.of();
        }

        int end = Math.min(allRecipes.size(), offset + limit);

        return allRecipes.subList(offset, end);
    }

    public List<RecipeSuggestionDTO> searchByQuery(String query, int limit, int offset) {
        String url = String.format("https://api.spoonacular.com/recipes/complexSearch?query=%s&number=%d&offset=%d&apiKey=%s",
                query, limit, offset, apiKey);

        RecipeSearchResponseDTO response = restTemplate.getForObject(url, RecipeSearchResponseDTO.class);
        return response != null ? response.getResults() : List.of();
    }

    public RecipeDetailDTO getRecipeDetails(Long id){
        String url = String.format("https://api.spoonacular.com/recipes/%d/information?apiKey=%s",id,apiKey);
        return restTemplate.getForObject(url,RecipeDetailDTO.class);
    }
}
