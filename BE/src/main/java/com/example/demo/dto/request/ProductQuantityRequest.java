package com.example.demo.dto.request;

import lombok.Data;

@Data
public class ProductQuantityRequest {
    private Long productOptionId;
    private int quantity;
}
