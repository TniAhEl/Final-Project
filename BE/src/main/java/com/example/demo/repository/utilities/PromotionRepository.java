package com.example.demo.repository.utilities;

import com.example.demo.model.utilities.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    boolean existsByName(String name);

    boolean existsByCode(String code);

    Promotion findPromotionByCode(String promotionCode);
}
