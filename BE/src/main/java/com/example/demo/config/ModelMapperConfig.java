package com.example.demo.config;

import com.example.demo.dto.response.order.OrderProductResponse;
import com.example.demo.dto.response.order.OrderResponse;
import com.example.demo.dto.response.order.OrderResponseDetail;
import com.example.demo.model.order.Order;
import com.example.demo.model.order.OrderProduct;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        // Vô hiệu hóa ánh xạ tự động từ Order → OrderResponseDetails cho field orderProducts
        modelMapper.typeMap(Order.class, OrderResponseDetail.class)
                .addMappings(mapper -> mapper.skip(OrderResponseDetail::setOrderProducts));


        return modelMapper;
    }

}
