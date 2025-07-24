package com.example.demo.model.utilities;

import com.example.demo.enums.ContractStatus;
import com.example.demo.model.product.OrderProductSerial;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "insurance_contract")
public class InsuranceContract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "create_at")
    private LocalDate create_at;

    @Column(name = "fee")
    private BigDecimal insuranceFee;

    @Column(name = "coverage_money")
    private BigDecimal coverageMoney;

    @OneToOne
    @JoinColumn(name = "order_product_serial_id")
    private OrderProductSerial orderProductSerial;

    @Column(name = "expired_date")
    private LocalDate expireDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_status")
    private ContractStatus status;

    @Column(name = "code")
    private String code;


    @ManyToOne
    @JoinColumn(name = "insurance_id")
    private Insurance insurance;

}
