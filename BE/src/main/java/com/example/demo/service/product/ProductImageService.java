package com.example.demo.service.product;

import com.example.demo.dto.response.product.ProductImageResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.Product;
import com.example.demo.model.product.ProductImage;
import com.example.demo.repository.product.ProductImageRepository;
import com.example.demo.service.impl.product.IProductImageService;
import com.example.demo.service.impl.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductImageService implements IProductImageService {

    private final ProductImageRepository productImageRepository;
    private final IProductService productService;

    @Override
    public List<ProductImageResponse> uploadImages(List<MultipartFile> files, Long productId) {
        Product product = productService.getProductById(productId);
        List<ProductImageResponse> responses = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                String uploadDir = "uploads/images/";
                String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir + fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, file.getBytes());

                String imageUrl = "/uploads/images/" + fileName;

                ProductImage image = new ProductImage();
                image.setFileName(file.getOriginalFilename());
                image.setFileType(file.getContentType());
                image.setImageUrl(imageUrl);
                image.setProduct(product);

                ProductImage saved = productImageRepository.save(image);

                responses.add(ProductImageResponse.builder()
                        .id(saved.getId())
                        .fileName(saved.getFileName())
                        .fileType(saved.getFileType())
                        .imageUrl(saved.getImageUrl())
                        .productId(productId)
                        .build());

            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image: " + file.getOriginalFilename());
            }
        }

        return responses;
    }

    @Override
    public ProductImage updateImage(Long id, MultipartFile file) {
        ProductImage existing = getImageById(id);

        try {
            // Xoá file cũ (nếu có)
            Path oldFilePath = Paths.get(existing.getImageUrl().replace("/uploads/images/", "uploads/images/"));
            Files.deleteIfExists(oldFilePath);

            // Lưu file mới
            String uploadDir = "uploads/images/";
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path newFilePath = Paths.get(uploadDir + fileName);
            Files.createDirectories(newFilePath.getParent());
            Files.write(newFilePath, file.getBytes());

            String newImageUrl = "/uploads/images/" + fileName;

            // Cập nhật thông tin
            existing.setFileName(file.getOriginalFilename());
            existing.setFileType(file.getContentType());
            existing.setImageUrl(newImageUrl);

            return productImageRepository.save(existing);

        } catch (IOException e) {
            throw new RuntimeException("Failed to update image with id: " + id);
        }
    }
    @Override
    public ProductImage getImageById(Long id) {
        return productImageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No image found with id: " + id));
    }

    @Override
    public void deleteImageById(Long id) {
        ProductImage image = getImageById(id);
        try {
            // Xóa file vật lý nếu cần
            Path imagePath = Paths.get(image.getImageUrl().replace("/uploads/images/", "uploads/images/"));
            Files.deleteIfExists(imagePath);
        } catch (IOException e) {
            // Ghi log nếu cần
        }

        productImageRepository.deleteById(id);
    }

    private ProductImageResponse toResponse(ProductImage image) {
        return ProductImageResponse.builder()
                .id(image.getId())
                .fileName(image.getFileName())
                .fileType(image.getFileType())
                .imageUrl(image.getImageUrl())
                .productId(image.getProduct().getId())
                .build();
    }

    @Override
    public List<ProductImageResponse> getImagesByProductId(Long productId) {
        Product product = productService.getProductById(productId);
        List<ProductImage> images = productImageRepository.findByProduct(product);

        List<ProductImageResponse> responses = new ArrayList<>();
        for (ProductImage image : images) {
            responses.add(toResponse(image));
        }
        return responses;
    }


}

