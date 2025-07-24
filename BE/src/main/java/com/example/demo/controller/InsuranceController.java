package com.example.demo.controller;

import com.example.demo.dto.request.FilterInsuranceContract;
import com.example.demo.dto.request.FilterOrderWarranty;
import com.example.demo.dto.request.utilities.CreateInsuranceRequest;
import com.example.demo.dto.request.utilities.UpdateInsuranceRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.utility.InsuranceResponse;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.utilities.Insurance;
import com.example.demo.service.impl.utility.IInsuranceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
@RequestMapping("${api.prefix}/insurances")
public class InsuranceController {

    private final IInsuranceService insuranceService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllInsurances(){
        try {
            List<Insurance > insurances = insuranceService.getAllInsurance();
            List<InsuranceResponse> insuranceResponses = insuranceService.convertToResponses(insurances);
            return ResponseEntity.ok(new ApiResponse("Found", insuranceResponses));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error", INTERNAL_SERVER_ERROR));
        }
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addInsurance(
            @Valid @RequestBody CreateInsuranceRequest request) {
        try {
            Insurance theInsurance = insuranceService.createInsurance(request);
            InsuranceResponse insuranceResponse = insuranceService.convertToResponse(theInsurance);
            return ResponseEntity.ok(new ApiResponse("Success", insuranceResponse));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse(e.getMessage(), null));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getInsuranceById(@PathVariable Long id){
        try {
            Insurance theInsurance = insuranceService.getInsuranceById(id);
            InsuranceResponse insuranceResponse = insuranceService.convertToResponse(theInsurance);
            return ResponseEntity.ok(new ApiResponse("Found!", insuranceResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }


    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateInsurance(@PathVariable Long id, @RequestBody UpdateInsuranceRequest request){
        try {
            Insurance theInsurance = insuranceService.updateInsurance(request, id);
            InsuranceResponse insuranceResponse = insuranceService.convertToResponse(theInsurance);
            return ResponseEntity.ok(new ApiResponse("Success", insuranceResponse));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }

    @PostMapping("/customer/filter")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> filterInsurancesContract(
            @RequestBody FilterInsuranceContract filter,
            @RequestParam int page,
            @RequestParam int size
    ){
        return ResponseEntity.ok(insuranceService.filterUserInsuranceContract(filter, page, size));
    }
}
