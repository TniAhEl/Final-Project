package com.example.demo.service.product;

import com.example.demo.dto.request.products.CreateCategoryRequest;
import com.example.demo.dto.request.products.UpdateCategoryRequest;
import com.example.demo.dto.response.AdminCategoryResponse;
import com.example.demo.dto.response.product.CategoryResponse;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.ProductCategory;
import com.example.demo.repository.product.ProductCategoryRepository;
import com.example.demo.service.impl.product.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService {
    private final ProductCategoryRepository productCategoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<ProductCategory> getAllCategory() {
        return productCategoryRepository.findAll();
    }

    @Override
    public ProductCategory getCategoryById(Long id) {
        return productCategoryRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Category not found!"));

    }

    @Override
    public ProductCategory getCategoryByName(String name) {
        return productCategoryRepository.findByName(name);
    }

    @Override
    public ProductCategory addCategory(CreateCategoryRequest request) {
        if (productCategoryRepository.existsByName(request.getName())) {
            throw new AlreadyExistsException("Category already exist");

        }
        ProductCategory category = new ProductCategory();
        category.setName(request.getName());
        category.setCreateAt(LocalDateTime.now());
        category.setUpdateAt(LocalDateTime.now());
        return productCategoryRepository.save(category);

    }

    @Override
    public ProductCategory updateCategory(UpdateCategoryRequest request, Long id) {
       ProductCategory existingCategory = productCategoryRepository.findById(id)
               .orElseThrow(()-> new ResourceNotFoundException("Category not found!"));

       existingCategory.setName(request.getName());
       existingCategory.setUpdateAt(LocalDateTime.now());

       return productCategoryRepository.save(existingCategory);
    }

    @Override
    public void deleteCategory(Long id) {
        productCategoryRepository.findById(id)
                .ifPresentOrElse(productCategoryRepository::delete,()->{
                    throw new ResourceNotFoundException("Category not found!");
                });
    }

    @Override
    public CategoryResponse convertToResponse(ProductCategory productCategory) {
        return modelMapper.map(productCategory, CategoryResponse.class);
    }

    @Override
    public List<CategoryResponse> convertToResponses(List<ProductCategory> productCategories) {
        return productCategories.stream().map(this::convertToResponse).toList();
    }

    @Override
    public AdminCategoryResponse convertToAdminResponse(ProductCategory productCategory) {
        return modelMapper.map(productCategory, AdminCategoryResponse.class);
    }
}
