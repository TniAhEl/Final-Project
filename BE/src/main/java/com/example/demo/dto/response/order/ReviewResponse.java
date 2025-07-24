package com.example.demo.dto.response.order;

import com.example.demo.enums.ReviewStatus;
import com.example.demo.model.product.ProductReviewReply;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private String id;
    private ReviewReplyResponse reply;
    private UserReview user;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private int rating;
    private String review;
    private ReviewStatus status;

}
