package com.example.demo.controller;

import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.cart.CartResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.Cart;
import com.example.demo.service.impl.product.ICartProductService;
import com.example.demo.service.impl.product.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/cart")
public class CartController {
    private final ICartService cartService;
    private final ICartProductService cartProductService;

    @GetMapping("/my-cart/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse> getCart(@PathVariable Long userId) {
        try {
            Cart cart = cartService.getCart(userId);
            CartResponse cartResponse = cartService.convertToResponse(cart);
            return ResponseEntity.ok(new ApiResponse("success", cartResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @DeleteMapping("/{cartId}/clear")
    public ResponseEntity<ApiResponse> cleanCart(@PathVariable Long cartId){
        try {
            cartService.clearCart(cartId);
            return ResponseEntity.ok(new ApiResponse("Clear Cart Success", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/{cartId}/cart/total-price")
    public ResponseEntity<ApiResponse> getTotalAmount(@PathVariable Long cartId){
        try {
            BigDecimal totalPrice = cartService.getTotalPrice(cartId);
            return ResponseEntity.ok(new ApiResponse("total price", totalPrice));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PostMapping("/add")
    public ResponseEntity<String> addProductToCart(
            @RequestParam Long userId,
            @RequestParam Long productOptionId,
            @RequestParam int quantity
    ) {
        cartProductService.addProductToCart(userId, productOptionId, quantity);
        return ResponseEntity.ok("Product added to cart successfully");
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateProductInCart(
            @RequestParam Long userId,
            @RequestParam Long productOptionId,
            @RequestParam int quantity
    ) {
        cartProductService.updateCartProductqQuantity(userId, productOptionId, quantity);

        return ResponseEntity.ok("Update Product in cart successfully");
    }
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteProductInCart(
            @RequestParam Long userId,
            @RequestParam Long productOptionId
    ){
        cartProductService.removeProductFromCart(userId, productOptionId);
        return ResponseEntity.ok("Delete product from cart successfully");
    }
}
