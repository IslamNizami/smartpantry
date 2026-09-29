package com.example.smartpantry.repository;

import com.example.smartpantry.model.enums.Category;
import com.example.smartpantry.model.entity.PantryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PantryItemRepository extends JpaRepository<PantryItem,Long> {

    List<PantryItem> findByCategory(Category category);
    List<PantryItem> findByExpiryDateBefore(LocalDate date);
    List<PantryItem> findTop5ByOrderByExpiryDateAsc();
    //This is for user's search bar
    List<PantryItem> findByNameContainingIgnoreCase(String name);

    //This is for backend's internal logic
    Optional<PantryItem> findByNameIgnoreCase(String name);
}
