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

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductImageService implements IProductImageService {

    private final ProductImageRepository productImageRepository;
    private final IProductService productService;
    @Override
    public ProductImage getImageById(Long id) {
        return productImageRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("No image found with id:" + id));
    }

    @Override
    public void deleteImageById(Long id) {
        productImageRepository.findById(id).ifPresentOrElse(productImageRepository::delete, ()->{
            throw new ResourceNotFoundException("No image found with id: " + id);
        });
    }

    @Override
    public List<ProductImageResponse> saveImage(List<MultipartFile> files, Long productId) {
        Product product = productService.getProductById(productId);
        List< ProductImageResponse> savedImageDtos = new ArrayList<>();
        for(MultipartFile file : files){
            try {
                ProductImage image = new ProductImage();
                image.setFileName(file.getOriginalFilename());
                image.setFileType(file.getContentType());
                image.setImage(new SerialBlob(file.getBytes()));
                image.setProduct(product);

                String buildDownloadUrl = "/api/v1/images/image/download";
                String downloadUrl = buildDownloadUrl+image.getId();
                image.setDownloadUrl(downloadUrl);
                ProductImage savedImage = productImageRepository.save(image);

                savedImage.setDownloadUrl(buildDownloadUrl+savedImage.getId());
                productImageRepository.save(savedImage);

                ProductImageResponse imageDto = new ProductImageResponse();
                imageDto.setImageId(savedImage.getId());
                imageDto.setImageName(savedImage.getFileName());
                imageDto.setDownloadUrl(savedImage.getDownloadUrl());
                savedImageDtos.add(imageDto);


            } catch (IOException | SQLException e) {
                throw new RuntimeException(e.getMessage());
            }
        }
        return savedImageDtos;
    }

    @Override
    public void updateImage(MultipartFile files, Long imageId) {
        ProductImage image =getImageById(imageId);
        try {
            image.setFileName(files.getOriginalFilename());
            image.setFileName(files.getOriginalFilename());
            image.setImage(new SerialBlob(files.getBytes()));
            productImageRepository.save(image);
        } catch (IOException | SQLException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
