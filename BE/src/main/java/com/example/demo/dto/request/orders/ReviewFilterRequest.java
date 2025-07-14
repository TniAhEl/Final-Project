package com.example.demo.dto.request.orders;

import com.example.demo.enums.ReviewStatus;
import lombok.Data;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Data
public class ReviewFilterRequest {
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int rating;
    private ReviewStatus status;
    private String sortField;
}
