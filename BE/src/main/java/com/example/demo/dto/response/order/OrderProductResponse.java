package com.example.demo.dto.response.order;

import com.example.demo.enums.ColorName;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderProductResponse {
    private Long id;
    private BigDecimal price;
    private ColorName colorName;
    private Long productId;
    private int ram;
    private int rom;
    private String name;
    private boolean isReviewed;
}
