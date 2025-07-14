package com.example.demo.controller;

import com.example.demo.dto.request.utilities.CreateWarrantyRequest;
import com.example.demo.dto.request.utilities.UpdateWarrantyRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.utility.WarrantyResponse;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.utilities.Warranty;
import com.example.demo.service.impl.utility.IWarrantyService;
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
@RequestMapping("${api.prefix}/warranties")
public class WarrantyController {
    private final IWarrantyService warrantyService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllWarranties(){
        try {
            List<Warranty> warranties = warrantyService.getAllWarranty();
            return ResponseEntity.ok(new ApiResponse("Found", warranties));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error", INTERNAL_SERVER_ERROR));
        }
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> createWarranty(
            @Valid @RequestBody CreateWarrantyRequest request) {
        try {
            Warranty theWarranty = warrantyService.createWarranty(request);
            WarrantyResponse warrantyResponse = warrantyService.convertToResponse(theWarranty);
            return ResponseEntity.ok(new ApiResponse("Success", warrantyResponse));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }
    @GetMapping("/warranty/{id}")
    public ResponseEntity<ApiResponse> getWarrantyById(@PathVariable Long id){
        try {
            Warranty theWarranty = warrantyService.getWarrantyById(id);
            WarrantyResponse warrantyResponse = warrantyService.convertToResponse(theWarranty);
            return ResponseEntity.ok(new ApiResponse("Found!", warrantyResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }

    @DeleteMapping("/delete/warranty/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteWarranty(@PathVariable Long id){
        try {
            warrantyService.deleteWarranty(id);
            return ResponseEntity.ok(new ApiResponse("Delete warranty successfully", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }

    @PutMapping("/update/warranty/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateWarranty(@PathVariable Long id, @RequestBody UpdateWarrantyRequest request){
        try {
            Warranty updateWarranty = warrantyService.updateWarranty(request, id);
            WarrantyResponse warrantyResponse = warrantyService.convertToResponse(updateWarranty);
            return ResponseEntity.ok(new ApiResponse("Success", warrantyResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }


}
