package com.example.demo.dto.response.utility;

import com.example.demo.dto.response.UserResponse;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class InsuranceContractResponse {
    // insurance_contract
    private BigDecimal coverageMoney;
    private LocalDate createAt;
    private LocalDate expiredDate;
    private BigDecimal fee;
    private Long contractId;
    private Long insuranceId;
    private Long orderProductSerialId;
    private String contractStatus;
    private String code;

    // insurance
    private InsuranceResponse insuranceResponse;

    //
    private UserResponse userResponse;
}
