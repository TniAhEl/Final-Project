package com.example.demo.dto.response.cart;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CartResponse {
    private Long id;
    private BigDecimal totalMoney ;
    private LocalDateTime updateAt;
    private List<CartProductResponse> cartProducts;
}
