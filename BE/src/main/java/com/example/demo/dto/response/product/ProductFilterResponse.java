package com.example.demo.dto.response.product;

import lombok.Data;

import java.util.List;

@Data
public class ProductFilterResponse {
    private Long id;
    private String name;
    private CategoryResponse category;

    private List<ProductOptionResponse> option;
    private String screenDimension;
    private String screenTech;
    private String screenResolution;
}
