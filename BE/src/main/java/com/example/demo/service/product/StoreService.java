package com.example.demo.service.product;


import com.example.demo.dto.request.products.CreateStoreRequest;
import com.example.demo.dto.request.products.UpdateStoreRequest;
import com.example.demo.dto.response.product.StoreResponse;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.Product;
import com.example.demo.model.product.Store;
import com.example.demo.repository.product.ProductRepository;
import com.example.demo.repository.product.StoreRepository;
import com.example.demo.service.impl.product.IStoreService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreService implements IStoreService {
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;
    @Override
    public List<Store> getAllStore() {
        return storeRepository.findAll();
    }

    @Override
    public Store getStoreById(Long id) {
        return storeRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Store not found!"));
    }

    @Override
    public StoreResponse convertToResponse(Store store) {
        return modelMapper.map(store, StoreResponse.class);
    }


    @Override
    public List<StoreResponse> convertToResponses(List<Store> stores) {
        return stores.stream().map(this::convertToResponse).toList();
    }

    @Override
    public Store createStore(CreateStoreRequest request) {
        if(storeRepository.existsByName(request.getName()) || storeRepository.existsByLocation(request.getLocation())){
            throw new AlreadyExistsException("Store already exist");
        }
        Store store = new Store();
        store.setName(request.getName());
        store.setLocation(request.getLocation());
        store.setUpdateAt(LocalDateTime.now());

        return storeRepository.save(store);
    }

    @Override
    public Store updateStore(UpdateStoreRequest request, Long id) {
        Store existingStore = storeRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Store not found!"));

        if(storeRepository.existsByName(request.getName()) && storeRepository.existsByLocation(request.getLocation())){
            throw new AlreadyExistsException("Store already exist");
        }
        else {
        existingStore.setName(request.getName());
        existingStore.setLocation(request.getLocation());
        existingStore.setUpdateAt(LocalDateTime.now());}

        return storeRepository.save(existingStore);
    }

    @Override
    public void addProductToStore(Long productId, Long storeId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));

        product.getStores().add(store);
        productRepository.save(product);
    }

}
