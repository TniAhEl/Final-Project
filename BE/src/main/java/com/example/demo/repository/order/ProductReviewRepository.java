package com.example.demo.repository.order;

import com.example.demo.model.product.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    boolean existsByUserIdAndOrderProductId(Long userId, Long orderProductId);

    @Query(value = """
            SELECT r.*
            FROM product_review r
            JOIN order_product op ON r.order_product_id = op.id
            JOIN product_option po ON op.product_option = po.id
            JOIN product p ON po.product_id = p.id
    WHERE p.id = :productId
    """, nativeQuery = true)
    List<ProductReview> findAllByProductId(@Param("productId") Long productId);

}
