package com.example.demo.service.impl.utility;

import com.example.demo.dto.request.FilterWarrantyRequest;
import com.example.demo.dto.request.utilities.CreateWarrantyRequest;
import com.example.demo.dto.request.utilities.UpdateWarrantyRequest;
import com.example.demo.dto.response.utility.WarrantyResponse;
import com.example.demo.model.utilities.Warranty;

import java.util.List;
import java.util.Map;

public interface IWarrantyService {
    List<Warranty> getAllWarranty();
    Warranty getWarrantyById(Long id);
    Warranty createWarranty(CreateWarrantyRequest request);
    Warranty updateWarranty(UpdateWarrantyRequest request, Long id);
    void deleteWarranty(Long id);

    WarrantyResponse convertToResponse(Warranty warranty);

    Map<String, Object> filterCustomerWarranty(FilterWarrantyRequest request, int page, int size);
}
