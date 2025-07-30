package com.example.demo.dto.response;

import com.example.demo.enums.ColorName;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ListProductResponse {
    private Long id;
    private String name;
    private int ram;
    private int rom;
    private ColorName colorName;
    private BigDecimal price;
    private int availableQuantity;

}
