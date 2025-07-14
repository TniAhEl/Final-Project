package com.example.demo.dto.response.utility;

import com.example.demo.enums.DiscountStatus;
import com.example.demo.enums.DiscountType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PromotionResponse {
    private Long id;
    private String name;
    private String description;
    private String code;
    private DiscountType type;
    private BigDecimal value;
    private LocalDate startDate;
    private LocalDate endDate;
    private DiscountStatus status;
    private int quantity;
}
