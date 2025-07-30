package com.example.demo.model.auth;

import com.example.demo.enums.CustomerStatus;
import com.example.demo.model.UserMonthlyReports;
import com.example.demo.model.order.Order;
import com.example.demo.model.product.Cart;
import com.example.demo.model.product.ProductReview;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "customer")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "user")
    private List<ProductReview> productReviews = new ArrayList<>();
    @OneToMany(mappedBy = "user")
    private List<ReceiverInfo> receiverInfos = new ArrayList<>();

    @Column(name = "username", unique = true, nullable = false)
    private String username;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "fname")
    private String firstName;
    @Column(name = "lname")
    private String lastName;
    @Column(name = "bday")
    private LocalDate bday;
    @Column(name = "address")
    private String address;
    @Column(name = "email")
    private String email;
    @Column(name = "phone")
    private String phone;

    @CreationTimestamp
    @Column(name = "create_at")
    private LocalDateTime createAt;
    @CreationTimestamp
    @Column(name = "update_at")
    private LocalDateTime updateAt;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CustomerStatus status =  CustomerStatus.ACTIVE;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Cart cart;

    @OneToMany(mappedBy = "user")
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "user")
    private List<UserMonthlyReports> reports = new ArrayList<>();

}
