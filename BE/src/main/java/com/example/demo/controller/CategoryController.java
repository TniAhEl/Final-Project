package com.example.demo.controller;

import com.example.demo.dto.request.products.CreateCategoryRequest;
import com.example.demo.dto.request.products.UpdateCategoryRequest;
import com.example.demo.dto.response.AdminCategoryResponse;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.product.CategoryResponse;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.ProductCategory;
import com.example.demo.service.impl.product.ICategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/categories")
public class CategoryController {

    private final ICategoryService categoryService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllCategories(){
        try {
            List<ProductCategory> categoryList = categoryService.getAllCategory();
            List<CategoryResponse> categoryResponses = categoryService.convertToResponses(categoryList);
            return ResponseEntity.ok(new ApiResponse("Found", categoryResponses));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error", INTERNAL_SERVER_ERROR));
        }
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addCategory(
            @Valid @RequestBody CreateCategoryRequest request) {
        try {
            ProductCategory theCategory = categoryService.addCategory(request);
            AdminCategoryResponse categoryResponse = categoryService.convertToAdminResponse(theCategory);
            return ResponseEntity.ok(new ApiResponse("Success", categoryResponse));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }
    @GetMapping("/category/{id}")
    public ResponseEntity<ApiResponse> getCategoryById(@PathVariable Long id){
        try {
            ProductCategory theCategory = categoryService.getCategoryById(id);
            CategoryResponse categoryResponse = categoryService.convertToResponse(theCategory);
            return ResponseEntity.ok(new ApiResponse("Found!", categoryResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }

    @GetMapping("/category/name/{name}")
    public ResponseEntity<ApiResponse> getCategoryByName(@PathVariable String name){
        try {
            ProductCategory theCategory = categoryService.getCategoryByName(name);
            CategoryResponse categoryResponse = categoryService.convertToResponse(theCategory);
            return ResponseEntity.ok(new ApiResponse("Found", categoryResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
    @DeleteMapping("/delete/category/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long id){
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(new ApiResponse("Delete category successfully", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }

    @PutMapping("/update/category/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateCategory(@PathVariable Long id, @RequestBody UpdateCategoryRequest request){
        try {
            ProductCategory updateCategory = categoryService.updateCategory(request, id);
            AdminCategoryResponse categoryResponse = categoryService.convertToAdminResponse(updateCategory);
            return ResponseEntity.ok(new ApiResponse("Success", categoryResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }


}
