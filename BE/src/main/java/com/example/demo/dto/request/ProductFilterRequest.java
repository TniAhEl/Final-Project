package com.example.demo.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductFilterRequest {
    private List<String> categoryName;
    private List<String> brand;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private List<String> ram;
    private List<String> rom;
    private List<Integer> battery;
    private List<String> os;
    private List<String> screenResolution;
}
