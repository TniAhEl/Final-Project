package com.example.demo.dto.request.utilities;

import com.example.demo.enums.DiscountStatus;
import com.example.demo.enums.DiscountType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdatePromotionRequest {
    private String name;
    private String description;
    private String code;
    @NotNull
    private DiscountType type;
    private BigDecimal value;
    private LocalDate startDate;
    private LocalDate endDate;
    @NotNull
    private DiscountStatus status;
    private int quantity;
    private int remainingQuantity;
}
