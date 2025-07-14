package com.example.demo.service.impl.product;

import com.example.demo.dto.request.products.CreateCategoryRequest;
import com.example.demo.dto.request.products.UpdateCategoryRequest;
import com.example.demo.dto.response.AdminCategoryResponse;
import com.example.demo.dto.response.product.CategoryResponse;
import com.example.demo.model.product.ProductCategory;

import java.util.List;

public interface ICategoryService {
    List<ProductCategory> getAllCategory();

    ProductCategory getCategoryById(Long id);
    ProductCategory getCategoryByName(String name);

    ProductCategory addCategory(CreateCategoryRequest request);
    ProductCategory updateCategory(UpdateCategoryRequest request, Long id);
    void deleteCategory(Long id);

    CategoryResponse convertToResponse(ProductCategory productCategory);
    List<CategoryResponse> convertToResponses(List<ProductCategory> productCategories);

    AdminCategoryResponse convertToAdminResponse(ProductCategory productCategory);
}
