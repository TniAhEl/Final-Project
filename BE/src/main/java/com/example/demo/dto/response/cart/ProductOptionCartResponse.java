package com.example.demo.dto.response.cart;

import com.example.demo.enums.ColorName;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductOptionCartResponse {
    private Long id;
    private BigDecimal price;
    private String productName;
    private ColorName colorName;
    private int ram;
    private int rom;
}
