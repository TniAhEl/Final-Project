package com.example.demo.service.impl.product;

import com.example.demo.dto.response.product.ProductImageResponse;
import com.example.demo.model.product.ProductImage;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IProductImageService {
    ProductImage getImageById(Long id);
    void deleteImageById(Long id);
    List<ProductImageResponse> saveImage(List<MultipartFile> files, Long productId);
    void updateImage(MultipartFile files, Long imageId);
}
