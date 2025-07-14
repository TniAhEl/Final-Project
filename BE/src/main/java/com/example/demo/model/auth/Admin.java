package com.example.demo.model.auth;

import com.example.demo.enums.AdminRole;
import com.example.demo.model.product.ProductReviewReply;
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
@Table(name = "admin")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
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
    @Column(name = "role")
    private AdminRole adminRole =  AdminRole.ADMIN;

    @OneToMany(mappedBy = "admin")
    public List<ProductReviewReply> productReviewReplies = new ArrayList<>();


}
