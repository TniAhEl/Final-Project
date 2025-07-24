package com.example.demo.dto.request.utilities;

import lombok.Data;

@Data
public class InsurancePendingRequest {
    private Long insuranceId;
    private Long productOptionId;
    private Long quantity;
}
