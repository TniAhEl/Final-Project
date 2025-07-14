package com.example.demo.dto.request.orders;

import lombok.Data;

@Data
public class CreateReviewRequest {
    private int rating;
    private String review;
}
