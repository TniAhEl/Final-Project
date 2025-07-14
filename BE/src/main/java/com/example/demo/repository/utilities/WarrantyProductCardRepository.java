package com.example.demo.repository.utilities;

import com.example.demo.model.utilities.WarrantyProductCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WarrantyProductCardRepository extends JpaRepository<WarrantyProductCard, Long> {
}
