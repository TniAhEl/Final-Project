package com.example.demo.dto.request.utilities;

import com.example.demo.enums.InsuranceStatus;
import jakarta.persistence.Column;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateInsuranceRequest {
    private String name;
    private LocalDate releaseAt;
    private int  insured;
    private String terms;
    private BigDecimal coverageMoney;
    private String provider;
    private BigDecimal fee;
}
