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
    public ResponseEntity<ApiResponse> saveImages(@RequestParam List<MultipartFile> files, @RequestParam Long productId){
        try {
            List<ProductImageResponse> imageDtos= imageService.saveImage(files, productId);
            return ResponseEntity.ok(new ApiResponse("Upload success!", imageDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("Upload fail",e.getMessage()));
        }
    }

    @GetMapping("/image/download/{imageId}")
    public  ResponseEntity<Resource> downloadImage(@PathVariable Long imageId) throws SQLException {
        ProductImage image = imageService.getImageById(imageId);
        ByteArrayResource resource = new ByteArrayResource(image.getImage().getBytes(1, (int) image.getImage().length()));
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(image.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename= \""+image.getFileName() +"\"")
                .body(resource);
    }
    @PutMapping("/image/{imageId}/update")
    public ResponseEntity<ApiResponse> upadteImage(@PathVariable Long imageId, @RequestBody MultipartFile file){
        try {
            ProductImage image = imageService.getImageById(imageId);
            if (image != null){
                imageService.updateImage(file,imageId);
                return ResponseEntity.ok(new ApiResponse("Update success", null));
            }
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
        return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Update fail", INTERNAL_SERVER_ERROR));

    }


    @DeleteMapping("/image/{imageId}/delete")
    public ResponseEntity<ApiResponse> upadteImage(@PathVariable Long imageId){
        try {
            ProductImage image = imageService.getImageById(imageId);
            if (image != null){
                imageService.deleteImageById(imageId);
                return ResponseEntity.ok(new ApiResponse("Delete success", null));
            }
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
        return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Delete fail", INTERNAL_SERVER_ERROR));

    }
}
