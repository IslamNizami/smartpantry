package com.example.smartpantry.controller;


import com.example.smartpantry.model.dto.PantryItemRequestDTO;
import com.example.smartpantry.model.dto.PantryItemResponseDTO;
import com.example.smartpantry.model.entity.PantryItem;
import com.example.smartpantry.service.PantryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/** GET /api/items  (list all)
 *  POST /api/items (add new)
 *  DELETE /api/items/{id} (Remove)
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
public class PantryController {

    private final PantryService pantryService;

    @GetMapping
    public List<PantryItem> getAllItems() {
        return pantryService.getAllItems();
    }

    @PostMapping
    public PantryItemResponseDTO addItem(@Valid @RequestBody PantryItemRequestDTO request) {
        // Map Request -> Entity
        PantryItem entity = new PantryItem();
        entity.setName(request.getName());
        entity.setQuantity(request.getQuantity());
        entity.setExpiryDate(request.getExpiryDate());
        entity.setCategory(request.getCategory());
        entity.setUnit(request.getUnit());

        PantryItem saved = pantryService.addItem(entity);

        // Map Entity -> Response
        return mapToResponse(saved);
    }

    @PutMapping("/{id}")
    public PantryItem updateItem(@PathVariable Long id, @RequestBody PantryItem item) {
        return pantryService.updateItem(id, item);
    }

    @PutMapping("/{id}/use")
    public void useItem(@PathVariable Long id, @RequestParam Double amount) {
        pantryService.useItem(id, amount);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id) {
        pantryService.deleteItem(id);
    }

    @GetMapping("/urgent")
    public List<PantryItem> getUrgentItems() {
        return pantryService.getUrgentItems();
    }

    // Helper method to convert Entity to DTO
    private PantryItemResponseDTO mapToResponse(PantryItem item) {
        return new PantryItemResponseDTO(
                item.getId(),
                item.getName(),
                item.getQuantity(),
                item.getUnit(),
                item.getCategory(),
                calculateExpiryStatus(item.getExpiryDate())
        );
    }

    private String calculateExpiryStatus(LocalDate expiryDate) {
        if (expiryDate == null) return "UNKNOWN";
        LocalDate today = LocalDate.now();
        if (expiryDate.isBefore(today)) return "EXPIRED";
        if (expiryDate.isBefore(today.plusDays(3))) return "EXPIRING_SOON";
        return "FRESH";
    }
}