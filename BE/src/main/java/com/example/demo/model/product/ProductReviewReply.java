package com.example.demo.model.product;

import com.example.demo.enums.ReviewStatus;
import com.example.demo.model.auth.Admin;
import com.example.demo.model.auth.User;
import com.example.demo.model.order.OrderProduct;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "product_review_reply")
public class ProductReviewReply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;


    @OneToOne
    @JoinColumn(name = "review_id")
    private ProductReview productReview;

    @Column(name = "create_at")
    private LocalDateTime createAt;
    @Column(name = "update_at")
    private LocalDateTime updateAt;

    @Column(name = "reply")
    private String reply;
    @Column(name = "status")
    private ReviewStatus status;
}
