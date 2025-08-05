package com.example.demo.enums;

public enum ProductStatus {
    DRAFT,
    OUT_STOCK,
    ONSELL,
    PREORDER;

    public static ProductStatus fromString(String status) {
        if (status == null) return null;
        try {
            return ProductStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null; // or handle the error as appropriate
        }
    }
}
