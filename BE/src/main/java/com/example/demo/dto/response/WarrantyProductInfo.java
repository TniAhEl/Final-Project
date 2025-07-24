package com.example.demo.dto.response;

import com.example.demo.dto.response.utility.InsuranceResponse;
import com.example.demo.dto.response.utility.WarrantyResponse;
import com.example.demo.enums.WarrantyStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WarrantyProductInfo {
    private Long id;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private WarrantyStatus status;
    private String serial;
    private String productName;
    private WarrantyResponse warrantyResponse;

}
