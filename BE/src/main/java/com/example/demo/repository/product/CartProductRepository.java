package com.example.demo.repository.product;

import com.example.demo.model.product.CartProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartProductRepository extends JpaRepository<CartProduct, Long> {
    void deleteAllByCartId(Long cartId);

    Optional<CartProduct> findByCart_User_IdAndProductOption_Id(Long userId, Long productOptionId);

}
