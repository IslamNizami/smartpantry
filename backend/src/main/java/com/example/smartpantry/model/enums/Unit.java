package com.example.smartpantry.model.enums;

public enum Unit {
    PIECES("pcs"),
    GRAMS("g"),
    KILOGRAMS("kg"),
    MILLILITERS("ml"),
    LITERS("l"),
    TABLESPOONS("tbsp"),
    CUPS("cups");

    private final String label;
    Unit(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }


}
