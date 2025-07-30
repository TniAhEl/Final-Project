package com.example.demo.model;

import com.example.demo.model.auth.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "monthly_reports")
@Entity
public class UserMonthlyReports {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "total_order")
    private Long totalOrders;

    @Column(name = "total_pending_order")
    private Long totalPendingOrders;

    @Column(name = "total_confirm_order")
    private Long totalConfirmOrders;

    @Column(name = "total_product")
    private Long totalProducts;

    @Column(name = "total_spend_money")
    private BigDecimal totalSpendMoney;

    @Column(name = "total_review")
    private Long totalReview;

    @Column(name = "month")
    private int month;

    @Column(name = "year")
    private int year;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


}
