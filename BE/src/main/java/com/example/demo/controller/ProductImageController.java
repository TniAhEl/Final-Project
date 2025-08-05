package com.example.demo.controller;

import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.product.ProductImageResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.ProductImage;
import com.example.demo.service.impl.product.IProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/images")
public class ProductImageController {
    private final IProductImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse> uploadImages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("productId") Long productId
    ) {
        try {
            List<ProductImageResponse> imageDtos = imageService.uploadImages(files, productId);
            return ResponseEntity.ok(new ApiResponse("Upload success!", imageDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Upload failed", e.getMessage()));
        }
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<ApiResponse> getImage(@PathVariable Long imageId) {
        try {
            ProductImage image = imageService.getImageById(imageId);
            ProductImageResponse response = ProductImageResponse.builder()
                    .id(image.getId())
                    .fileName(image.getFileName())
                    .fileType(image.getFileType())
                    .imageUrl(image.getImageUrl())
                    .productId(image.getProduct().getId())
                    .build();
            return ResponseEntity.ok(new ApiResponse("Image fetched", response));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse> getImagesByProductId(@PathVariable Long productId) {
        try {
            List<ProductImageResponse> images = imageService.getImagesByProductId(productId);
            return ResponseEntity.ok(new ApiResponse("Fetched images successfully", images));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }



    @PutMapping("/{imageId}/update")
    public ResponseEntity<ApiResponse> updateImage(
            @PathVariable Long imageId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            ProductImage updated = imageService.updateImage(imageId, file);
            ProductImageResponse response = ProductImageResponse.builder()
                    .id(updated.getId())
                    .fileName(updated.getFileName())
                    .fileType(updated.getFileType())
                    .imageUrl(updated.getImageUrl())
                    .productId(updated.getProduct().getId())
                    .build();

            return ResponseEntity.ok(new ApiResponse("Update success", response));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Update failed", e.getMessage()));
        }
    }


    @DeleteMapping("/{imageId}")
    public ResponseEntity<ApiResponse> deleteImage(@PathVariable Long imageId) {
        try {
            imageService.deleteImageById(imageId);
            return ResponseEntity.ok(new ApiResponse("Delete success", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse("Delete failed", e.getMessage()));
        }
    }
}


