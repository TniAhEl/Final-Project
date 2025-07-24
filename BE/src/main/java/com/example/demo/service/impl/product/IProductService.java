package com.example.demo.service.impl.product;

import com.example.demo.dto.request.ProductFilterRequest;
import com.example.demo.dto.request.products.CreateProductRequest;
import com.example.demo.dto.request.products.UpdateProductRequest;
import com.example.demo.dto.response.product.ProductResponse;
import com.example.demo.model.product.Product;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface IProductService {

    Product createProduct(CreateProductRequest request);
    Product updateProduct(UpdateProductRequest request, Long id);

    ProductResponse convertToResponse(Product product);
    List<ProductResponse> convertToResponses(List<Product> products);

    Map<String, Object> filterAdminProducts(ProductFilterRequest filter, int page, int size);

    Product getProductById(Long id);

    Map<String, Object> filterProducts(ProductFilterRequest filter, int page, int size);

    List<String> getAllBrand();
}
