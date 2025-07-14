package com.example.demo.service.utility;

import com.example.demo.dto.request.utilities.CreatePromotionRequest;
import com.example.demo.dto.request.utilities.UpdatePromotionRequest;
import com.example.demo.dto.response.utility.PromotionResponse;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.utilities.Promotion;
import com.example.demo.repository.utilities.PromotionRepository;
import com.example.demo.service.impl.utility.IPromotionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionService implements IPromotionService {
    private final PromotionRepository promotionRepository;
    private final ModelMapper  modelMapper;
    @Override
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    @Override
    public Promotion getPromotionById(Long id) {
        return promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found!"));
    }

    @Override
    public Promotion createPromotion(CreatePromotionRequest request) {
        if(promotionRepository.existsByName(request.getName())||promotionRepository.existsByCode(request.getCode())){
            throw new AlreadyExistsException("Promotion already exist");
        }

        Promotion promotion = new Promotion();
        promotion.setName(request.getName());
        promotion.setCode(request.getCode());
        promotion.setDescription(request.getDescription());
        promotion.setValue(request.getValue());
        promotion.setType(request.getType());
        promotion.setStatus(request.getStatus());
        promotion.setQuantity(request.getQuantity());
        promotion.setStartDate(request.getStartDate());
        promotion.setEndDate(request.getEndDate());
        promotion.setRemainingQuantity(request.getQuantity());

        return promotionRepository.save(promotion);

    }

    @Override
    public Promotion upadtePromotion(UpdatePromotionRequest request, Long id) {
        Promotion existingPromotion = promotionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found!"));

        existingPromotion.setName(request.getName());
        existingPromotion.setCode(request.getCode());
        existingPromotion.setDescription(request.getDescription());
        existingPromotion.setValue(request.getValue());
        existingPromotion.setType(request.getType());
        existingPromotion.setStatus(request.getStatus());
        existingPromotion.setQuantity(request.getQuantity());
        existingPromotion.setStartDate(request.getStartDate());
        existingPromotion.setEndDate(request.getEndDate());
        existingPromotion.setRemainingQuantity(request.getRemainingQuantity());

        return promotionRepository.save(existingPromotion);
    }

    @Override
    public PromotionResponse convertToResponse(Promotion promotion) {
        return modelMapper.map(promotion, PromotionResponse.class);
    }

    @Override
    public List<PromotionResponse> convertToResponses(List<Promotion> promotions) {
        return promotions.stream().map(this::convertToResponse).toList();
    }
}
