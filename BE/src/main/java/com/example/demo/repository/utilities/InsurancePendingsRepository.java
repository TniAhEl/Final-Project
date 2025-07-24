package com.example.demo.repository.utilities;

import com.example.demo.model.utilities.InsurancePending;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsurancePendingsRepository extends JpaRepository<InsurancePending, Long> {
    @Query("""
    SELECT ip FROM InsurancePending ip
    WHERE ip.order.id = :orderId
      AND ip.orderProduct.id = :orderProductId
""")
    List<InsurancePending> findByOrderAndOrderProduct(
            @Param("orderId") Long orderId,
            @Param("orderProductId") Long orderProductId
    );


}
