package com.example.demo.service.impl.product;

import com.example.demo.model.product.CartProduct;

public interface ICartProductService {
    void addProductToCart(Long userId, Long productOptionId, int quantity);
    void removeProductFromCart(Long userId, Long productOptionId);
    void updateCartProductqQuantity(Long userId, Long productOptionId, int quantity);

    CartProduct getCartProduct( Long productOptionId);
}
