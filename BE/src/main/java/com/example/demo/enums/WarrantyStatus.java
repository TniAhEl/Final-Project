package com.example.demo.enums;

public enum WarrantyStatus {
    ACTIVE,
    INACTIVE,
    EXPIRED;

    @Override
    public String toString() {
        return name(); // Trả về "ACTIVE"
    }

    }
