package com.example.demo.dto.request.utilities;

import com.example.demo.enums.DiscountStatus;
import com.example.demo.enums.DiscountType;
import jakarta.persistence.Column;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreatePromotionRequest {
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
