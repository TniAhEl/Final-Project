package com.example.demo.service.impl.utility;

import com.example.demo.dto.request.utilities.CreatePromotionRequest;
import com.example.demo.dto.request.utilities.UpdatePromotionRequest;
import com.example.demo.dto.response.utility.PromotionResponse;
import com.example.demo.model.utilities.Promotion;

import java.util.List;

public interface IPromotionService {
    List<Promotion> getAllPromotions();
    Promotion getPromotionById(Long id);
    Promotion createPromotion(CreatePromotionRequest request);
    Promotion upadtePromotion(UpdatePromotionRequest request, Long id);

    PromotionResponse convertToResponse(Promotion promotion);
    List<PromotionResponse> convertToResponses(List<Promotion> promotions);



}
