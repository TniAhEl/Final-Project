package com.example.demo.dto.request.products;

import com.example.demo.enums.ColorName;
import jakarta.persistence.Column;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateProductOptionRequest {
    private BigDecimal price;
    private ColorName colorName;
    private Long productId;
    private int ram;
    private int rom;
}
