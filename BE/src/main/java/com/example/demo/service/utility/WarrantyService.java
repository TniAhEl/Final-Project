package com.example.demo.service.utility;

import com.example.demo.dto.request.utilities.CreateWarrantyRequest;
import com.example.demo.dto.request.utilities.UpdateWarrantyRequest;
import com.example.demo.dto.response.utility.WarrantyResponse;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.utilities.Warranty;
import com.example.demo.repository.utilities.WarrantyRepository;
import com.example.demo.service.impl.utility.IWarrantyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class WarrantyService implements IWarrantyService {
    private final WarrantyRepository warrantyRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<Warranty> getAllWarranty() {
        return warrantyRepository.findAll();
    }

    @Override
    public Warranty getWarrantyById(Long id) {
        return warrantyRepository.findById(id). orElseThrow(() -> new ResourceNotFoundException("Warranty not found!"));
    }

    @Override
    public Warranty createWarranty(CreateWarrantyRequest request) {
        if(warrantyRepository.existsByName(request.getName())){
            throw new AlreadyExistsException("Warranty already exist");
        }
        Warranty warranty = new Warranty();
        warranty.setName(request.getName());
        warranty.setCondition(request.getCondition());
        warranty.setDuration(request.getDuration());
        warranty.setException(request.getException());
        warranty.setCreateAt(LocalDateTime.now());
        warranty.setUpdateAt(LocalDateTime.now());
        warranty.setNote(request.getNote());

        return warrantyRepository.save(warranty);
    }

    @Override
    @Transactional
    public Warranty updateWarranty(UpdateWarrantyRequest request, Long id) {
        Warranty existingWarranty = warrantyRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Warranty not found"));
        existingWarranty.setName(request.getName());
        existingWarranty.setNote(request.getNote());
        existingWarranty.setDuration(request.getDuration());
        existingWarranty.setCondition(request.getCondition());
        existingWarranty.setException(request.getException());
        existingWarranty.setUpdateAt(LocalDateTime.now());
        return warrantyRepository.save(existingWarranty);
    }

    @Override
    @Transactional
    public void deleteWarranty(Long id) {
        warrantyRepository.findById(id)
                .ifPresentOrElse(warrantyRepository::delete,()->{
            throw new ResourceNotFoundException("warranty not found!");
        });
    }

    @Override
    public WarrantyResponse convertToResponse(Warranty warranty) {
        return modelMapper.map(warranty, WarrantyResponse.class);
    }
}
