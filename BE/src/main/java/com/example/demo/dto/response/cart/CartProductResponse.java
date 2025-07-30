package com.example.demo.dto.response.cart;

import com.example.demo.dto.response.product.ProductOptionResponse;
import lombok.Data;

@Data
public class CartProductResponse {
    private Long id;
    private int quantity;
    private int availableQuantity;
    private ProductOptionCartResponse productOption;
}
