package com.example.demo.model.utilities;

import com.example.demo.model.order.Order;
import com.example.demo.model.order.OrderProduct;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "insurance_pending")
@Entity
public class InsurancePending {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "total_fee")
    private BigDecimal totalfee;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "insurance_id")
    private Insurance insurance;


    @ManyToOne
    @JoinColumn(name = "order_product_id")
    private OrderProduct orderProduct;





}
