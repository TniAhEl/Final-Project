package com.example.demo.dto.request.orders;

import com.example.demo.enums.ReviewStatus;
import lombok.Data;

@Data
public class UpdateReviewReplyRequest {
    private String reply;
    private ReviewStatus status;
}
