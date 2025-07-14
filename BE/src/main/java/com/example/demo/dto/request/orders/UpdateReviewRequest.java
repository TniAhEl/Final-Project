package com.example.demo.dto.request.orders;

import com.example.demo.enums.ReviewStatus;
import lombok.Data;

@Data
public class UpdateReviewRequest {
    private String review;
    private ReviewStatus status;
}
