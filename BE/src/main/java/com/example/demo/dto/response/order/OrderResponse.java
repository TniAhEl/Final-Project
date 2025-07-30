package com.example.demo.dto.response.order;

import com.example.demo.dto.response.UserResponse;
import com.example.demo.enums.OrderStatus;
import com.example.demo.enums.ShippingMethod;
import com.example.demo.model.order.OrderTransport;
import com.example.demo.model.utilities.OrderPromotion;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long id;
    private String name;
    private String phone;
    private String email;
    private String type;
    private OrderStatus status = OrderStatus.PENDING;
    private String shippingAddress;
    private String note;
    private LocalDateTime updateAt;
    private LocalDateTime createAt;
    private BigDecimal totalMoney;
    private ShippingMethod method;


}
