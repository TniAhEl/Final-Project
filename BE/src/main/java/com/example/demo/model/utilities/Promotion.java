package com.example.demo.model.utilities;

import com.example.demo.enums.DiscountStatus;
import com.example.demo.enums.DiscountType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "promotion")
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "code")
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type")
    private DiscountType type;

    @Column(name = "discount_value")
    private BigDecimal value;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private DiscountStatus status;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "remaining_quantity")
    private int remainingQuantity;


    @OneToMany(mappedBy = "promotion")
    private List<OrderPromotion> orderPromotions = new ArrayList<>();

}
