package com.example.demo.repository.order;

import com.example.demo.model.utilities.OrderPromotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderPromotionRepository extends JpaRepository<OrderPromotion, Long> {
}
