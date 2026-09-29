package com.example.smartpantry.service;

import com.example.smartpantry.model.entity.PantryItem;
import com.example.smartpantry.repository.PantryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PantryService {

    @Autowired
    private PantryItemRepository repository;

    // Get all Items
    public List<PantryItem> getAllItems(){
        return repository.findAll();
    }

    // Find items expiring in the next 3 days
    public List<PantryItem> getUrgentItems(){
        LocalDate threeDaysFromNow = LocalDate.now().plusDays(3);
        return repository.findByExpiryDateBefore(threeDaysFromNow);
    }

    // Ingredient Names for Spoonacular API
    public String getIngredientListForApi(){
        List<PantryItem> allItems = repository.findAll();

        //Join them with comas:
        return allItems.stream()
                .map(PantryItem::getName)
                .collect(Collectors.joining(","));
    }

    public void deleteItem(Long id){
        repository.deleteById(id);
    }

    public void useItem(Long id, Double amountUsed){
        repository.findById(id).ifPresent(item->{
            double newQuantity = item.getQuantity() - amountUsed;
            if(newQuantity <= 0){
                repository.delete(item);
            }else{
                item.setQuantity(newQuantity);
                repository.save(item);
            }
        });
    }


    public PantryItem addItem(PantryItem newItem){
        Optional<PantryItem> existingItem = repository.findByNameIgnoreCase(newItem.getName());

        if(existingItem.isPresent()){
            PantryItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + newItem.getQuantity());
            item.setExpiryDate(newItem.getExpiryDate());
            return repository.save(item);
        }

        return repository.save(newItem);
    }

    // General Update for the "Correcting Typos" scenario
    public PantryItem updateItem(Long id, PantryItem details) {
        return repository.findById(id).map(item -> {
            item.setName(details.getName());
            item.setQuantity(details.getQuantity());
            item.setExpiryDate(details.getExpiryDate());
            item.setCategory(details.getCategory());
            item.setUnit(details.getUnit());
            return repository.save(item);
        }).orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
    }
}
