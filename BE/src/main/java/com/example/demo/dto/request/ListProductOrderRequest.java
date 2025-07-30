package com.example.demo.dto.request;

import lombok.Data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ListProductOrderRequest {
    private List<ProductQuantityRequest> products= new ArrayList<>();;

}
