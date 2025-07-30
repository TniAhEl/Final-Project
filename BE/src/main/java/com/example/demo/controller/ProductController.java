package com.example.demo.controller;

import com.example.demo.dto.request.CompareRequest;
import com.example.demo.dto.request.GetListProductRequest;
import com.example.demo.dto.request.ProductFilterRequest;
import com.example.demo.dto.request.orders.ReviewFilterRequest;
import com.example.demo.dto.request.products.*;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.ListProductResponse;
import com.example.demo.dto.response.order.ReviewResponse;
import com.example.demo.dto.response.product.ProductOptionResponse;
import com.example.demo.dto.response.product.ProductResponse;
import com.example.demo.dto.response.product.ProductSerialResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.Product;
import com.example.demo.model.product.ProductOption;
import com.example.demo.model.product.ProductReview;
import com.example.demo.model.product.ProductSerial;
import com.example.demo.service.impl.order.IOrderReviewService;
import com.example.demo.service.impl.product.IProductOptionService;
import com.example.demo.service.impl.product.IProductSerialService;
import com.example.demo.service.impl.product.IProductService;
import com.example.demo.service.impl.product.IStoreService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("${api.prefix}/products")
public class ProductController {
    private final IProductService productService;
    private final IProductOptionService productOptionService;
    private final IProductSerialService productSerialService;
    private final IStoreService storeService;
    private final IOrderReviewService orderReviewService;

    @GetMapping("/product/{id}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Long id){
        try {
            Product product = productService.getProductById(id);
            ProductResponse productResponse =productService.convertToResponse(product);
            return ResponseEntity.ok(new ApiResponse("success", productResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }

    @PostMapping("/filter")
    public ResponseEntity<Map<String, Object>> filterProducts(
            @RequestBody ProductFilterRequest filter,
            @RequestParam int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Map<String, Object> result = productService.filterProducts(filter, page, size);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/admin/filter")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> filterAdminProducts(
            @RequestBody ProductFilterRequest filter,
            @RequestParam int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Map<String, Object> result = productService.filterAdminProducts(filter, page, size);
        return ResponseEntity.ok(result);
    }


    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addProduct(@RequestBody CreateProductRequest request) {
        try {
            Product theProduct = productService.createProduct(request);
            ProductResponse productResponse = productService.convertToResponse(theProduct);
            return ResponseEntity.ok(new ApiResponse("Add product success", productResponse));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateProduct(@RequestBody UpdateProductRequest request, @RequestParam Long id) {
        try {
            Product theProduct = productService.updateProduct(request, id);
            ProductResponse productResponse = productService.convertToResponse(theProduct);
            return ResponseEntity.ok(new ApiResponse("Update product success", productResponse));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }


    @PostMapping("/option/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addProductOption(@RequestBody CreateProductOptionRequest request) {
        try {
            ProductOption theOption = productOptionService.createProductOption(request);
            ProductOptionResponse productOptionResponse = productOptionService.convertToResponse(theOption);
            return ResponseEntity.ok(new ApiResponse("Add product option success", productOptionResponse));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PostMapping("/serial/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addSerial(@RequestBody CreateProductSerialRequest request) {
        try {
            ProductSerial serial = productSerialService.createSerial(request);
            ProductSerialResponse productSerialResponse = productSerialService.convertToResponse(serial);
            return ResponseEntity.ok(new ApiResponse("Add product serial success", productSerialResponse));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("serial/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllSerial(@RequestParam Long optionId) {
        try {
            List<ProductSerial> serial = productSerialService.getAllSerialByProductOptionId(optionId);
            List<ProductSerialResponse> productSerialResponse = productSerialService.convertToResponses(serial);
            return ResponseEntity.ok(new ApiResponse("Get all serial by option id", productSerialResponse));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/serial/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateSerial(@RequestBody UpdateProductSerialRequest request, @PathVariable Long id) {
        try {
            ProductSerial serial = productSerialService.updateSerial(request, id);
            ProductSerialResponse productSerialResponse = productSerialService.convertToResponse(serial);
            return ResponseEntity.ok(new ApiResponse("Update product serial success", productSerialResponse));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PostMapping("/add/store")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addProductToStore(@RequestBody AddProductToStoreRequest request) {
        storeService.addProductToStore(request.getProductId(), request.getStoreId());
        ApiResponse response = new ApiResponse("Add product to store successfully", true);
        return ResponseEntity.ok(response);
    }


    @GetMapping("brand/all")
    public ResponseEntity<ApiResponse> getAllBrand(){
        List<String> brand = productService.getAllBrand();
        return  ResponseEntity.ok(new ApiResponse("Get all brand success", brand));
    }

    @GetMapping("/{productId}/review/all")
    public ResponseEntity<ApiResponse> getAllReview(@PathVariable Long productId){
        List<ProductReview> review = orderReviewService.getAllReviewByProductId(productId);
        List<ReviewResponse> reviewResponses = orderReviewService.convertToResponses(review);
        return ResponseEntity.ok(new ApiResponse("Get all review success", reviewResponses));

    }

    @PostMapping("/all/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getAllReviews(
            @RequestBody ReviewFilterRequest request,
            @RequestParam int page,
            @RequestParam int size

    ){
        Map<String, Object> response = orderReviewService.filterReviews(request, page, size);
        return ResponseEntity.ok(new ApiResponse("success", response));

    }


    @PostMapping("/guest/product")
    public ResponseEntity<List<ListProductResponse>> getProductList(
            @RequestBody GetListProductRequest request
            ){
        return ResponseEntity.ok(productOptionService.getListProduct(request));
    }

    @PostMapping("/compare")
    public ResponseEntity<Map<String, Object>> compareProducts(@RequestBody CompareRequest request) {
        return ResponseEntity.ok(productService.filterCompareProducts(request));
    }

}
