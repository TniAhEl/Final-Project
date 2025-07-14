package com.example.demo.dto.response.product;

import com.example.demo.enums.ProductSerialStatus;
import lombok.Data;

@Data
public class ProductSerialResponse {
    private Long id;
    private ProductSerialStatus productListConfigStatus;
    private String serialNumber;
    private StoreResponse store;
}
