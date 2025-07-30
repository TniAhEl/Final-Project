package com.example.demo.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class GetListProductRequest {
    private List<ProductRequestItem> products; // productOptionId + requestedQuantity
}

