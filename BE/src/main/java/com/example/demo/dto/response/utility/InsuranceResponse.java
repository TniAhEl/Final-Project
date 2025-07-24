package com.example.demo.dto.response.utility;

import com.example.demo.enums.InsuranceStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class InsuranceResponse {
    private Long id;
    private String name;
    private LocalDate releaseAt;
    private int  insured;
    private String terms;
    private InsuranceStatus status;
    private BigDecimal coverageMoney;
    private String provider;
    private BigDecimal fee;
}
