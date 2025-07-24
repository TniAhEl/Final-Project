package com.example.demo.model.utilities;

import com.example.demo.enums.InsuranceStatus;
import com.example.demo.model.order.OrderProduct;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "insurance")
public class Insurance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "release_at")
    private LocalDate releaseAt;

    @Column(name = "insured")
    private int insured;

    @Column(name = "terms")
    private String terms;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private InsuranceStatus status;

    @Column(name = "coverage_money")
    private BigDecimal coverageMoney;

    @Column(name = "provider")
    private String provider;

    @Column(name = "fee")
    private BigDecimal fee;

    @Column(name = "create_at")
    private LocalDateTime createAt;

    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @OneToMany(mappedBy = "insurance")
    private List<InsuranceContract> insuranceContracts;

    @OneToMany(mappedBy = "insurance")
    private List<InsurancePending> insurancePendings = new ArrayList<>();



}
