package com.example.demo.service.impl.product;

import com.example.demo.dto.request.products.CreateStoreRequest;
import com.example.demo.dto.request.products.UpdateStoreRequest;
import com.example.demo.dto.response.product.StoreResponse;
import com.example.demo.model.product.Store;

import java.util.List;

public interface IStoreService {
    List<Store> getAllStore();
    Store getStoreById(Long id);
    StoreResponse convertToResponse(Store store);
    List<StoreResponse> convertToResponses(List<Store> stores);
    Store createStore(CreateStoreRequest request);
    Store updateStore(UpdateStoreRequest request, Long id);
    void addProductToStore(Long productId, Long storeId);

}
