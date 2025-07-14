package com.example.demo.dto.request.utilities;

import com.example.demo.enums.InsuranceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateInsuranceRequest {
    private String name;
    private LocalDate releaseAt;
    private String  insured;
    private String terms;
    private InsuranceStatus status;
    private BigDecimal coverageMoney;
    private String provider;
    private BigDecimal fee;
}
