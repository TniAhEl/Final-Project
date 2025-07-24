package com.example.demo.dto.response;

import com.example.demo.dto.response.product.CustomerProductOption;
import com.example.demo.dto.response.product.ProductOptionResponse;
import com.example.demo.dto.response.utility.WarrantyResponse;
import com.example.demo.enums.WarrantyStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CustomerWarrantyResponse {
    private Long warrantyId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private WarrantyStatus status;
    private String serialNumber;
    private CustomerProductOption optionResponse;
    private String productName;
    private WarrantyResponse warrantyPolicy;


}
