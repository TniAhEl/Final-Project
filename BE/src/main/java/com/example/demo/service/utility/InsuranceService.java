package com.example.demo.service.utility;

import com.example.demo.dto.request.utilities.CreateInsuranceRequest;
import com.example.demo.dto.request.utilities.UpdateInsuranceRequest;
import com.example.demo.dto.response.utility.InsuranceResponse;
import com.example.demo.enums.InsuranceStatus;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.utilities.Insurance;
import com.example.demo.repository.utilities.InsuranceRepository;
import com.example.demo.service.impl.utility.IInsuranceService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
@RequiredArgsConstructor
public class InsuranceService implements IInsuranceService {
    private final InsuranceRepository insuranceRepository;
    private final ModelMapper modelMapper;
    @Override
    public Insurance getInsuranceById(Long id) {
        return insuranceRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Insurance not found !"));
    }

    @Override
    public List<Insurance> getAllInsurance() {
        return insuranceRepository.findAll();
    }

    @Override
    public Insurance createInsurance(CreateInsuranceRequest request) {
        if(insuranceRepository.existsByName(request.getName()) && insuranceRepository.existsByProvider(request.getProvider())){
            throw new AlreadyExistsException("Insurance already exists with name "+ request.getName() +" and provider " +request.getProvider());
        }

        Insurance insurance = new Insurance();
        insurance.setName(request.getName());
        insurance.setReleaseAt(request.getReleaseAt());
        insurance.setInsured(request.getInsured());
        insurance.setTerms(request.getTerms());
        insurance.setStatus(InsuranceStatus.ACTIVE);
        insurance.setCoverageMoney(request.getCoverageMoney());
        insurance.setProvider(request.getProvider());
        insurance.setFee(request.getFee());
        insurance.setCreateAt(LocalDateTime.now());
        insurance.setUpdateAt(LocalDateTime.now());



        return insuranceRepository.save(insurance);
    }

    @Override
    public Insurance updateInsurance(UpdateInsuranceRequest request, Long id) {

        Insurance existingInsurance = insuranceRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Insurance not found with id:" + id));

        existingInsurance.setName(request.getName());
        existingInsurance.setReleaseAt(request.getReleaseAt());
        existingInsurance.setInsured(request.getInsured());
        existingInsurance.setTerms(request.getTerms());
        existingInsurance.setStatus(request.getStatus());
        existingInsurance.setCoverageMoney(request.getCoverageMoney());
        existingInsurance.setProvider(request.getProvider());
        existingInsurance.setFee(request.getFee());
        existingInsurance.setUpdateAt(LocalDateTime.now());

        return insuranceRepository.save(existingInsurance);
    }

    @Override
    public InsuranceResponse convertToResponse(Insurance insurance) {
        return modelMapper.map(insurance, InsuranceResponse.class);
    }

    @Override
    public List<InsuranceResponse> convertToResponses(List<Insurance> insurances) {
        return insurances.stream().map(this::convertToResponse).toList();
    }
}
