package com.example.demo.model.order;

import com.example.demo.enums.OrderStatus;
import com.example.demo.enums.ShippingMethod;
import com.example.demo.model.auth.User;
import com.example.demo.model.utilities.InsurancePending;
import com.example.demo.model.utilities.OrderPromotion;
import com.example.demo.model.utilities.WarrantyProductCard;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "order_table")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "order")
    private List<WarrantyProductCard> warrantyProductCards = new ArrayList<>();
    @OneToOne(mappedBy = "order")
    private OrderPromotion orderPromotion;

    @OneToMany(mappedBy = "order")
    private List<InsurancePending> insurancePendings = new ArrayList<>();

    @OneToOne(mappedBy = "order")
    private OrderTransport orderTransport;

    @Column(name = "type")
    private String type;
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    private OrderStatus status = OrderStatus.PENDING;
    @Column(name = "shipping_address")
    private String shippingAddress;
    @Enumerated(EnumType.STRING)
    @Column(name = "transport_method")
    private ShippingMethod method;

    @Column(name = "note")
    private String note;
    @Column(name = "update_at")
    private LocalDateTime updateAt;
    @Column(name = "create_at")
    private LocalDateTime createAt;
    @Column(name = "total_money")
    private BigDecimal totalMoney;
    @OneToMany(mappedBy = "order")
    private List<OrderProduct> orderProducts = new ArrayList<>();

}
