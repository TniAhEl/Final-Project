package com.example.demo.service.impl.product;

import com.example.demo.dto.request.CompareRequest;
import com.example.demo.dto.request.ProductFilterRequest;
import com.example.demo.dto.request.products.CreateProductRequest;
import com.example.demo.dto.request.products.UpdateProductRequest;
import com.example.demo.dto.response.product.ProductFilterResponse;
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

    Map<String, Object> filterCompareProducts(CompareRequest request);

    Product getProductById(Long id);


    ProductFilterResponse convertFilterResponse(Map<String, Object> row);


    List<ProductFilterResponse> convertToFilterResponses(List<Map<String, Object>> rows);

    Map<String, Object> filterProducts(ProductFilterRequest filter, int page, int size);

    List<String> getAllBrand();
}
