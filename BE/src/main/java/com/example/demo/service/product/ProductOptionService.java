package com.example.demo.service.product;

import com.example.demo.dto.request.products.CreateProductOptionRequest;
import com.example.demo.dto.response.product.ProductOptionResponse;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.Product;
import com.example.demo.model.product.ProductOption;
import com.example.demo.repository.product.ProductOptionRepository;
import com.example.demo.repository.product.ProductRepository;
import com.example.demo.service.impl.product.IProductOptionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductOptionService implements IProductOptionService {
    private final ProductOptionRepository productOptionRepository;
    private final ProductRepository productRepository;

    private final ModelMapper modelMapper;

    @Override
    public ProductOption getOptionById(Long id) {
        return productOptionRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Option not Found!"));
    }

    @Override
    public ProductOption createProductOption(CreateProductOptionRequest request) {


        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(()->new ResourceNotFoundException("Product not found with id"+ request.getProductId()));

        ProductOption productOption = buildOption(request, product);

        return productOptionRepository.save(productOption);
    }

    @Override
    public ProductOptionResponse convertToResponse(ProductOption productOption) {
        return modelMapper.map(productOption, ProductOptionResponse.class);
    }

    @Override
    public List<ProductOptionResponse> convertToResponse(List<ProductOption> productOptions) {
        return productOptions.stream().map(this::convertToResponse).toList();
    }

    private ProductOption buildOption(CreateProductOptionRequest request, Product product){
        ProductOption productOption = new ProductOption();

        productOption.setRam(request.getRam());
        productOption.setRom(request.getRom());
        productOption.setPrice(request.getPrice());
        productOption.setColorName(request.getColorName());
        productOption.setProduct(product);

        return productOption;

    }
}
