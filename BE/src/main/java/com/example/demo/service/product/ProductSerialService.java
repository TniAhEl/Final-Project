package com.example.demo.service.product;

import com.example.demo.dto.request.products.CreateProductSerialRequest;
import com.example.demo.dto.request.products.UpdateProductSerialRequest;
import com.example.demo.dto.response.product.ProductSerialResponse;
import com.example.demo.dto.response.product.StoreResponse;
import com.example.demo.enums.ProductSerialStatus;
import com.example.demo.exception.AlreadyExistsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.Product;
import com.example.demo.model.product.ProductOption;
import com.example.demo.model.product.ProductSerial;
import com.example.demo.model.product.Store;
import com.example.demo.repository.product.ProductOptionRepository;
import com.example.demo.repository.product.ProductRepository;
import com.example.demo.repository.product.ProductSerialRepository;
import com.example.demo.repository.product.StoreRepository;
import com.example.demo.service.impl.product.IProductSerialService;
import com.example.demo.service.impl.product.IProductService;
import com.example.demo.service.impl.product.IStoreService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductSerialService implements IProductSerialService {
    private final IStoreService storeService;

    private final ProductSerialRepository productSerialRepository;
    private final ProductOptionRepository productOptionRepository;
    private final StoreRepository storeRepository;
    private final ModelMapper modelMapper;
    private final ProductRepository productRepository;

    @Override
    public List<ProductSerial> getAllSerial() {
        return productSerialRepository.findAll();
    }

    @Override
    public List<ProductSerial> getAllSerialByProductOptionId(Long optionId) {
        return productSerialRepository.findAllByProductOption_Id(optionId);
    }

    @Override
    public ProductSerial createSerial(CreateProductSerialRequest request) {
        if(productSerialRepository.existsBySerialNumber(request.getSerialNumber())){
            throw new AlreadyExistsException("Serial number "+request.getSerialNumber()+ " already exist!");
        }

        ProductOption option = productOptionRepository.findById(request.getProductOptionId())
                .orElseThrow(() -> new RuntimeException("Product option not found"));

        option.setRemainingQuantity(option.getRemainingQuantity()+1);

        ProductSerial productSerial = buildSerial(request, option);
        return productSerialRepository.save(productSerial);
    }

    private ProductSerial buildSerial(CreateProductSerialRequest request, ProductOption option){
        ProductSerial  productSerial = new ProductSerial();
        productSerial.setSerialNumber(request.getSerialNumber());
        productSerial.setProductListConfigStatus(ProductSerialStatus.AVAILABLE);
        productSerial.setProductOption(option);

        return  productSerial;

    }

    @Override
    public ProductSerial updateSerial(UpdateProductSerialRequest request, Long id) {
        ProductSerial productSerial = productSerialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serial not found with id: " + id));

        Store store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + request.getStoreId()));

        ProductOption option = productOptionRepository.findById(productSerial.getProductOption().getId()).orElseThrow(()-> new ResourceNotFoundException("Product option not found!"));
        if(request.getStatus()!=ProductSerialStatus.AVAILABLE){
            option.setRemainingQuantity(option.getRemainingQuantity() - 1);
            productOptionRepository.save(option);
        } else if(request.getStatus()!= productSerial.getProductListConfigStatus() || request.getStatus() == ProductSerialStatus.AVAILABLE){
            option.setRemainingQuantity(option.getRemainingQuantity()+1);
            productOptionRepository.save(option);
        }

        Optional<Product> product = productRepository.findById(option.getProduct().getId());

        storeService.addProductToStore(product.get().getId(), store.getId());

        updateSerialFields(productSerial, request, store);

        return productSerialRepository.save(productSerial);
    }

    private void updateSerialFields(ProductSerial productSerial, UpdateProductSerialRequest request, Store store) {
        productSerial.setSerialNumber(request.getSerialNumber());
        productSerial.setProductListConfigStatus(request.getStatus());
        productSerial.setStore(store);
    }


    @Override
    public ProductSerialResponse convertToResponse(ProductSerial productSerial) {
        ProductSerialResponse productSerialResponse = modelMapper.map(productSerial, ProductSerialResponse.class);

        // Store -> store response
        Store store = productSerial.getStore();
        if (store != null) {
            StoreResponse storeResponse = modelMapper.map(store, StoreResponse.class);
            productSerialResponse.setStore(storeResponse);
        }


        return  productSerialResponse;
    }

    @Override
    public List<ProductSerialResponse> convertToResponses(List<ProductSerial> productSerials) {
        return productSerials.stream().map(this::convertToResponse).toList();
    }
}
