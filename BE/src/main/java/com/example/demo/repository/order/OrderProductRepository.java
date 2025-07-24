package com.example.demo.repository.order;

import com.example.demo.model.order.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderProductRepository extends JpaRepository<OrderProduct, Long> {
    List<OrderProduct> findByOrderId(Long id);

    List<OrderProduct> findAllByOrder_Id(Long orderId);


}
