package com.example.demo.dto.request.orders;

import com.example.demo.enums.OrderStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderFilterRequest {
    private String type;
    private OrderStatus status;
    private String promotionCode;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal minTotalMoney;
    private BigDecimal maxTotalMoney;

}
