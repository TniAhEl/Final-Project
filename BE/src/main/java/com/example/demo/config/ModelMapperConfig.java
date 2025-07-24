package com.example.demo.config;

import com.example.demo.dto.response.order.OrderResponse;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Vô hiệu hóa ánh xạ tự động từ Order → OrderResponse cho field orderProducts
        modelMapper.typeMap(com.example.demo.model.order.Order.class, OrderResponse.class)
                .addMappings(mapper -> mapper.skip(OrderResponse::setOrderProducts));

        return modelMapper;
    }

}
