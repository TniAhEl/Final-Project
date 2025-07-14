package com.example.demo.model.order;

import com.example.demo.model.product.OrderProductSerial;
import com.example.demo.model.product.ProductOption;
import com.example.demo.model.product.ProductReview;
import com.example.demo.model.utilities.Insurance;
import com.example.demo.model.utilities.InsuranceContract;
import com.example.demo.model.utilities.InsurancePending;
import com.example.demo.model.utilities.OrderPromotion;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "order_product")
public class OrderProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "orderProduct")
    private ProductReview productReview;

    @Column(name = "quantity")
    private int quantity;
    @Column(name = "price")
    private BigDecimal unitPrice;
    @Column(name = "update_at")
    private LocalDateTime updateAt;


    @OneToMany(mappedBy = "orderProduct")
    private List<OrderProductSerial> orderProductSerials = new ArrayList<>();

    @OneToMany(mappedBy = "orderProduct")
    private List<InsurancePending> insurancePendings = new ArrayList<>();

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_option",nullable = false)
    private ProductOption productOption;

    public OrderProduct(Order order, ProductOption productOption, BigDecimal unitPrice, int quantity){
        this.order = order;
        this.productOption =productOption;
        this.unitPrice = productOption.getPrice();
        this.quantity = quantity;
    }
}
