package com.example.demo.model.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="store")
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "location")
    private String location;

    @Column(name ="update_at")
    private LocalDateTime updateAt;

    @ManyToMany(mappedBy = "stores")
    private Set<Product> products = new HashSet<>();

    @OneToMany(mappedBy = "store")
    private List<ProductSerial> productSerials = new ArrayList<>();
}
