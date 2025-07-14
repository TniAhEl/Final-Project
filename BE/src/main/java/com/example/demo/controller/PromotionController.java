package com.example.demo.controller;

import com.example.demo.dto.request.utilities.CreatePromotionRequest;
import com.example.demo.dto.request.utilities.UpdatePromotionRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.utility.PromotionResponse;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.utilities.Promotion;
import com.example.demo.service.impl.utility.IPromotionService;
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
@RequestMapping("${api.prefix}/promotions")
public class PromotionController {
    private final IPromotionService promotionService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllPromotions(){
        try {
            List<Promotion> promotions = promotionService.getAllPromotions();
            List<PromotionResponse> promotionResponses = promotionService.convertToResponses(promotions);
            return ResponseEntity.ok(new ApiResponse("Found", promotionResponses));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error", INTERNAL_SERVER_ERROR));
        }
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createPromotion(
            @Valid @RequestBody CreatePromotionRequest request) {
        try {
            Promotion thePromotion = promotionService.createPromotion(request);
            PromotionResponse promotionResponse = promotionService.convertToResponse(thePromotion);
            return ResponseEntity.ok(new ApiResponse("Success", promotionResponse));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }
    @GetMapping("/promotion/{id}")
    public ResponseEntity<ApiResponse> getPromotionById(@PathVariable Long id){
        try {
            Promotion thePromotion = promotionService.getPromotionById(id);
            PromotionResponse promotionResponse = promotionService.convertToResponse(thePromotion);
            return ResponseEntity.ok(new ApiResponse("Found!", promotionResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }

    @PutMapping("/update/promotion/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updatePromotion(@PathVariable Long id, @RequestBody UpdatePromotionRequest request){
        try {
            Promotion updatePromotion = promotionService.upadtePromotion(request, id);
            PromotionResponse promotionResponse = promotionService.convertToResponse(updatePromotion);
            return ResponseEntity.ok(new ApiResponse("Success", promotionResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
}
