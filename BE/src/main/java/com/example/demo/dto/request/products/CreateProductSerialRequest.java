package com.example.demo.dto.request.products;

import lombok.Data;

@Data
public class CreateProductSerialRequest {
    private String serialNumber;
    private Long productOptionId;
}
