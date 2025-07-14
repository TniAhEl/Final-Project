package com.example.demo.model.product;

import com.example.demo.enums.ColorName;
import com.example.demo.model.order.OrderProduct;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "product_option")
public class ProductOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "price")
    private BigDecimal price;
    @Column(name = "color_name")
    private ColorName colorName;
    @Column(name = "ram")
    private int ram;
    @Column(name = "rom")
    private int rom;

    @Column(name = "remaining_quantity")
    private int remainingQuantity;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @OneToMany(mappedBy = "productOption")
    private List<ProductSerial> productSerials = new ArrayList<>();

    @OneToMany(mappedBy = "productOption")
    private List<CartProduct> cartProducts = new ArrayList<>();

    @OneToMany(mappedBy = "productOption")
    private List<OrderProduct> orderProducts = new ArrayList<>();

}
