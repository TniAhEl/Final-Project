package com.example.demo.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class CompareRequest {
    private List<Long> productId;
}
