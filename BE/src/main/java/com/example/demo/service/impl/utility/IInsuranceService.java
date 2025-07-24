package com.example.demo.service.impl.utility;

import com.example.demo.dto.request.FilterInsuranceContract;
import com.example.demo.dto.request.utilities.CreateInsuranceRequest;
import com.example.demo.dto.request.utilities.UpdateInsuranceRequest;
import com.example.demo.dto.response.utility.InsuranceResponse;
import com.example.demo.model.utilities.Insurance;

import java.util.List;
import java.util.Map;

public interface IInsuranceService {
    Insurance getInsuranceById(Long id);
    List<Insurance> getAllInsurance();

    Insurance createInsurance(CreateInsuranceRequest request);
    Insurance updateInsurance(UpdateInsuranceRequest request, Long id);

    InsuranceResponse convertToResponse(Insurance insurance);
    List<InsuranceResponse> convertToResponses(List<Insurance> insurances);
    Map<String, Object> filterUserInsuranceContract(FilterInsuranceContract filter, int page, int size);

}
