package com.example.demo.model.product;

import com.example.demo.enums.ProductSerialStatus;
import com.example.demo.model.utilities.WarrantyProductCard;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "product_serial")
public class ProductSerial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ProductSerialStatus productListConfigStatus = ProductSerialStatus.AVAILABLE;
    @Column(name = "serial_number" , nullable = false)
    private String serialNumber;

    @OneToOne(mappedBy = "productSerial")
    private WarrantyProductCard warrantyProductCard;

    @ManyToOne
    @JoinColumn(name = "product_option_id")
    private ProductOption productOption;

    @ManyToOne
    @JoinColumn(name = "store_id")
    private Store store;
    @OneToMany(mappedBy = "productSerial")
    private List<OrderProductSerial> orderProductSerials = new ArrayList<>();



}
