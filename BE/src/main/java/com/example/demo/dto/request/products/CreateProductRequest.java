package com.example.demo.dto.request.products;

import com.example.demo.enums.ProductStatus;
import com.example.demo.model.product.ProductCategory;
import com.example.demo.model.utilities.Warranty;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CreateProductRequest {
    private String name;
    private String description;
    private String brand;
    private ProductStatus productStatus = ProductStatus.DRAFT;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    private Long categoryId;
    private Long warrantyId;

    private String os;
    private String cpu;
    private BigDecimal cpuSpeed;
    private String gpu;
    private BigDecimal batteryCapacity;
    private String batteryType;
    private String chargeSupport;
    private String batteryTech;

    private String screenDimension;
    private boolean flash;
    private String frontCamera;
    private String backCamera;
    private String screenTouch;
    private String screenTech;
    private String screenResolution;
    private String maxBrightness;
    private String backCameraTech;
    private String backCameraRecord;


    private String mobileNetwork;
    private String bluetooth;
    private String sim;
    private String wifi;
    private String gps;
    private String chargePort;
    private String earphonePort;
    private String anotherPort;

    private String design;
    private String material;
    private String dimension;
    private int releaseYear;

    private String musicUtil;
    private String movieUtil;
    private String recordUtil;
    private String resistanceUtil;
    private String specialUtil;
    private String advancedUtil;
}
