package com.example.demo.service.impl.product;

import com.example.demo.dto.request.products.CreateProductOptionRequest;
import com.example.demo.dto.response.product.ProductOptionResponse;
import com.example.demo.model.product.ProductOption;

import java.util.List;

public interface IProductOptionService {
    ProductOption getOptionById(Long id);
    ProductOption createProductOption(CreateProductOptionRequest request);

    ProductOptionResponse convertToResponse(ProductOption productOption);
    List<ProductOptionResponse> convertToResponse(List<ProductOption> productOptions);


}
