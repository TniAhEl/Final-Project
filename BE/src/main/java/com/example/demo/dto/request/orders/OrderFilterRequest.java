package com.example.demo.dto.request.orders;

import com.example.demo.enums.OrderStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderFilterRequest {
    private List<String> types;
    private List<OrderStatus> statuses;
    private List<String> promotionCodes;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal minTotalMoney;
    private BigDecimal maxTotalMoney;
}

