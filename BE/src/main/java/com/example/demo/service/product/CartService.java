package com.example.demo.service.product;

import com.example.demo.dto.response.cart.CartProductResponse;
import com.example.demo.dto.response.cart.CartResponse;
import com.example.demo.dto.response.cart.ProductOptionCartResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.Cart;
import com.example.demo.model.product.CartProduct;
import com.example.demo.model.product.ProductOption;
import com.example.demo.repository.product.CartProductRepository;
import com.example.demo.repository.product.CartRepository;
import com.example.demo.service.impl.product.ICartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService {
    private final CartRepository cartRepository;
    private final CartProductRepository cartProductRepository;
    private final ModelMapper modelMapper;
    private final AtomicLong cartIdGenerator = new AtomicLong();
    @Override
    public Cart getCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId);

        if (cart == null) return null;

        for (CartProduct cartProduct : cart.getCartProducts()) {
            ProductOption option = cartProduct.getProductOption();

            int remaining = option.getRemainingQuantity();
            int reserved = option.getReversedQuantity();

            int available = remaining - reserved;
            cartProduct.setAvailableQuantity(Math.max(available, 0));
            cartProduct.setQuantity(Math.min(available, cartProduct.getQuantity()));
        }

        cart.setUpdateAt(LocalDateTime.now());

        return cart;

    }


    @Transactional
    @Override
    public void clearCart(Long cartId) {
        Optional<Cart> optionalCart = cartRepository.findById(cartId);
        if (optionalCart.isEmpty()) {
            throw new ResourceNotFoundException("Cart not found with id: " + cartId);
        }

        Cart cart = optionalCart.get();
        cartProductRepository.deleteAllByCartId(cartId);
        cart.getCartProducts().clear();
        cart.setTotalMoney(BigDecimal.ZERO);
        cart.setUpdateAt(LocalDateTime.now());
        cartRepository.save(cart);
    }


    @Override
    public Cart getCartByCustomerId(Long customerId) {
        return cartRepository.findByUserId(customerId);
    }

    @Override
    public BigDecimal getTotalPrice(Long cartId) {
        Cart cart = getCart(cartId);
        return cart.getTotalMoney();
    }

    @Override
    public CartResponse convertToResponse(Cart cart) {
        CartResponse cartResponse = modelMapper.map(cart, CartResponse.class);

        // Convert the list of CartProduct → CartProductResponse
        List<CartProductResponse> cartProducts = cart.getCartProducts().stream()
                .map(this::convertToCartProductResponse)
                .toList();

        cartResponse.setCartProducts(cartProducts);

        return cartResponse;
    }

    private CartProductResponse convertToCartProductResponse(CartProduct cartProduct) {
        CartProductResponse response = new CartProductResponse();
        response.setId(cartProduct.getId());
        response.setQuantity(cartProduct.getQuantity());
        response.setAvailableQuantity(cartProduct.getAvailableQuantity());

        // Convert ProductOption → ProductOptionCartResponse
        ProductOptionCartResponse optionResponse = convertToProductOptionCartResponse(cartProduct.getProductOption());
        response.setProductOption(optionResponse);

        return response;
    }

    private ProductOptionCartResponse convertToProductOptionCartResponse(ProductOption option) {
        ProductOptionCartResponse response = new ProductOptionCartResponse();
        response.setId(option.getId());
        response.setPrice(option.getPrice());
        response.setColorName(option.getColorName());
        response.setRam(option.getRam());
        response.setRom(option.getRom());

        if (option.getProduct() != null) {
            response.setProductName(option.getProduct().getName());
        }

        return response;
    }


}
