package com.example.demo.repository.order;

import com.example.demo.model.product.OrderProductSerial;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderProductSerialRepository extends JpaRepository<OrderProductSerial, Long> {
}
