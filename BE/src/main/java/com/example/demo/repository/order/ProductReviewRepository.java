package com.example.demo.repository.order;

import com.example.demo.model.product.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    boolean existsByUserIdAndOrderProductId(Long userId, Long orderProductId);
}
