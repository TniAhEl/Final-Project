package com.example.demo.service.impl.product;

import com.example.demo.dto.response.product.ProductImageResponse;
import com.example.demo.model.product.ProductImage;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IProductImageService {
    List<ProductImageResponse> uploadImages(List<MultipartFile> files, Long productId);

    ProductImage updateImage(Long id, MultipartFile file);

    ProductImage getImageById(Long id);

    void deleteImageById(Long id);

    List<ProductImageResponse> getImagesByProductId(Long productId);
}
