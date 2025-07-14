package com.example.demo.dto.request.products;

import lombok.Data;

@Data
public class AddProductToStoreRequest {
    private Long productId;
    private Long storeId;
}
