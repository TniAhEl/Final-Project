package com.example.demo.service.impl.product;

import com.example.demo.dto.response.cart.CartResponse;
import com.example.demo.model.product.Cart;

import java.math.BigDecimal;

public interface ICartService {

    Cart getCart(Long cartId);
    void clearCart(Long cartId);

    Cart getCartByCustomerId(Long customerId);

    BigDecimal getTotalPrice(Long cartId);
    CartResponse convertToResponse(Cart cart);
}
