package com.example.demo.dto.request.utilities;

import lombok.Data;

@Data
public class InsuranceContractRequest {
    private Long insuranceId;
    private Long orderProductId;
    private int quantity;
}
