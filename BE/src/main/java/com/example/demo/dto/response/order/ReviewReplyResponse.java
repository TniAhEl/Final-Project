package com.example.demo.dto.response.order;

import com.example.demo.enums.ReviewStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewReplyResponse {
    private Long id;
    private AdminResponse admin;
    private LocalDateTime createAt;
    private LocalDateTime UpdateAt;
    private String reply;
    private ReviewStatus status;
}
