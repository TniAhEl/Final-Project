package com.example.demo.dto.response.order;

import com.example.demo.dto.response.utility.PromotionResponse;
import com.example.demo.model.order.Order;
import com.example.demo.model.utilities.Promotion;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderPromotionResponse {
    private Long id;
    private LocalDateTime updateAt;
    private BigDecimal totalDiscount;
    private PromotionResponse promotionInfo;
}
