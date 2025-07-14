package com.example.demo.service.product;

import com.example.demo.exception.OutOfRemainingResourceException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.Cart;
import com.example.demo.model.product.CartProduct;
import com.example.demo.model.product.ProductOption;
import com.example.demo.repository.product.CartProductRepository;
import com.example.demo.repository.product.CartRepository;
import com.example.demo.service.impl.product.ICartProductService;
import com.example.demo.service.impl.product.IProductOptionService;
import com.example.demo.service.impl.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartProductService implements ICartProductService {
    private final CartRepository cartRepository;
    private final CartProductRepository cartProductRepository;
    private final IProductOptionService productOptionService;
    @Override
    public void addProductToCart(Long userId, Long productOptionId, int quantity) {
        Cart cart = cartRepository.findByUserId(userId);
        ProductOption productOption = productOptionService.getOptionById(productOptionId);

        Optional<CartProduct> existing = cartProductRepository.findByCart_User_IdAndProductOption_Id(userId, productOptionId);

        CartProduct cartProduct;

        if (existing.isPresent()){
            cartProduct = existing.get();
            if(cartProduct.getQuantity()<productOption.getRemainingQuantity()||(cartProduct.getQuantity()+quantity)<productOption.getRemainingQuantity()){
            cartProduct.setQuantity(cartProduct.getQuantity()+quantity);}
            else {
                throw new OutOfRemainingResourceException("The remaining quantity is not enough!");
            }
        } else {
            cartProduct = new CartProduct();
            cartProduct.setCart(cart);
            cartProduct.setProductOption(productOption);
            if(quantity<productOption.getRemainingQuantity()){
            cartProduct.setQuantity(quantity);}
            else {
                throw new OutOfRemainingResourceException("The remaining quantity is not enough!");
            }
        }


        cart.setUpdateAt(LocalDateTime.now());
        cart.setTotalMoney(productOption.getPrice().multiply(BigDecimal.valueOf(quantity+cartProduct.getQuantity())));
        cartRepository.save(cart);
        cartProductRepository.save(cartProduct);
    }

    @Override
    public void removeProductFromCart(Long userId, Long productOptionId) {
        CartProduct cartProduct = cartProductRepository.findByCart_User_IdAndProductOption_Id(userId, productOptionId)
                .orElseThrow(()-> new ResourceNotFoundException("Product not found in cart!"));
        cartProductRepository.delete(cartProduct);
    }

    @Override
    public void updateCartProductqQuantity(Long userId, Long productOptionId, int quantity) {
        CartProduct cartProduct = cartProductRepository.findByCart_User_IdAndProductOption_Id(userId, productOptionId)
                .orElseThrow(()->new ResourceNotFoundException("Product not found in cart!"));
        ProductOption productOption = productOptionService.getOptionById(productOptionId);
        if(quantity > 0 && quantity <= productOption.getRemainingQuantity()){
        cartProduct.setQuantity(quantity);}
        else {
            throw new OutOfRemainingResourceException("The remaining quantity is not enough!");
        }
        cartProductRepository.save(cartProduct);
    }

    @Override
    public CartProduct getCartProduct(Long userId, Long productId) {
        return null;
    }
}
