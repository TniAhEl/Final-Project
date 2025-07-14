package com.example.demo.dto.response.product;

import lombok.Data;

@Data
public class ProductImageResponse {
    private Long imageId;
    private String imageName;
    private String downloadUrl;
}
