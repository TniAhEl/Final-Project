package com.example.demo.dto.request.products;

import com.example.demo.enums.ProductSerialStatus;
import lombok.Data;

@Data
public class UpdateProductSerialRequest {
    private ProductSerialStatus status;
    private String serialNumber;
    private Long storeId;
}
