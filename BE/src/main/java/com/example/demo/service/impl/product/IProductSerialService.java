package com.example.demo.service.impl.product;

import com.example.demo.dto.request.products.CreateProductSerialRequest;
import com.example.demo.dto.request.products.UpdateProductSerialRequest;
import com.example.demo.dto.response.PaginationResponse;
import com.example.demo.dto.response.product.ProductSerialResponse;
import com.example.demo.model.product.ProductSerial;

import java.util.List;


public interface IProductSerialService {
    List<ProductSerial> getAllSerial();


    PaginationResponse<ProductSerialResponse> getAllSerialByProductOptionId(Long optionId, int page, int size);


    ProductSerial createSerial(CreateProductSerialRequest request);
    ProductSerial updateSerial(UpdateProductSerialRequest request, Long id);




    ProductSerialResponse convertToResponse(ProductSerial productSerial);
    List<ProductSerialResponse> convertToResponses(List<ProductSerial> productSerials);
}
