package com.example.demo.controller;

import com.example.demo.dto.request.products.CreateStoreRequest;
import com.example.demo.dto.request.products.UpdateStoreRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.product.StoreResponse;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.Store;
import com.example.demo.service.impl.product.IStoreService;
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
@RequestMapping("${api.prefix}/stores")
public class StoreController {

    private final IStoreService storeService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllStore(){
        try {
            List<Store> stores = storeService.getAllStore();
            List<StoreResponse> storeResponses = storeService.convertToResponses(stores);
            return ResponseEntity.ok(new ApiResponse("Found", storeResponses));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error", INTERNAL_SERVER_ERROR));
        }
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createStore(
            @Valid @RequestBody CreateStoreRequest request) {
        try {
            Store store = storeService.createStore(request);
            StoreResponse storeResponse = storeService.convertToResponse(store);
            return ResponseEntity.ok(new ApiResponse("Success", storeResponse));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }
    @GetMapping("/store/{id}")
    public ResponseEntity<ApiResponse> getPromotionById(@PathVariable Long id){
        try {
            Store store = storeService.getStoreById(id);
            StoreResponse storeResponse = storeService.convertToResponse(store);
            return ResponseEntity.ok(new ApiResponse("Found!", storeResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }

    @PutMapping("/update/store/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updatePromotion(@PathVariable Long id, @RequestBody UpdateStoreRequest request){
        try {
            Store store = storeService.updateStore(request, id);
            StoreResponse storeResponse = storeService.convertToResponse(store);
            return ResponseEntity.ok(new ApiResponse("Success", storeResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
}
