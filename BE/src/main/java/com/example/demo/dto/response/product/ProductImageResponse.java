package com.example.demo.dto.response.product;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductImageResponse {
    private Long id;
    private String fileName;
    private String fileType;
    private String imageUrl;
    private Long productId;


}

