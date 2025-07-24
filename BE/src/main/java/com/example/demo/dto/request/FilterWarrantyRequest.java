package com.example.demo.dto.request;

import com.example.demo.enums.WarrantyStatus;
import lombok.Data;

@Data
public class FilterWarrantyRequest {
    private Long userId;
    private WarrantyStatus status;
}
