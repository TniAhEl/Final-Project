package com.example.demo.dto.response.product;

import com.example.demo.enums.ProductStatus;
import lombok.Data;

import java.util.List;

@Data
public class ProductFilterResponse {
    private Long id;
    private String name;
    private CategoryResponse category;
    private String brand;
    private int releaseYear;
    private ProductStatus status;
    private List<ProductOptionResponse> option;
    private String screenDimension;
    private String screenTech;
    private String screenResolution;
    private ProductImageResponse image;
}
