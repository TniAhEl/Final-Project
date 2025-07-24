package com.example.demo.repository.order;

import com.example.demo.model.order.OrderTransport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderTransportRepository extends JpaRepository<OrderTransport, Long> {
    OrderTransport findByOrderId(Long id);
}
