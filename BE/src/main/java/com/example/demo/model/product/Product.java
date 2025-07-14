package com.example.demo.model.product;

import com.example.demo.enums.ProductStatus;
import com.example.demo.model.utilities.Warranty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "product")
    private List<ProductOption> productOptions = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "warranty_id")
    private Warranty warranty;


    @OneToMany(mappedBy = "product")
    private List<ProductImage> productImages = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ProductCategory productCategory;


    @ManyToMany
    @JoinTable(
            name = "map_product_store",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "store_id")
    )
    private Set<Store> stores = new HashSet<>();

    @Column(name = "name", unique = true, nullable = false)
    private String name;
    @Column(name = "description")
    private String description;
    @Column(name = "brand")
    private String brand;
    @Enumerated(EnumType.STRING)
    @Column(name = "product_status", nullable = false)
    private ProductStatus productStatus = ProductStatus.DRAFT;
    @Column(name = "create_at" )
    private LocalDateTime createAt;
    @Column(name = "update_at" )
    private LocalDateTime updateAt;

    //Config
    @Column(name = "os")
    private String os;
    @Column(name = "cpu")
    private String cpu;
    @Column(name = "cpu_speed")
    private BigDecimal cpuSpeed;
    @Column(name = "gpu")
    private String gpu;
    @Column(name = "battery_capacity")
    private BigDecimal batteryCapacity;
    @Column(name = "battery_type")
    private String batteryType;
    @Column(name = "charge_support")
    private String chargeSupport;
    @Column(name = "battery_tech")
    private String batteryTech;

    //Camera Screen
    @Column(name = "screen_dimension")
    private String screenDimension;
    @Column(name = "flash")
    private boolean flash;
    @Column(name = "front_camera")
    private String frontCamera;
    @Column(name = "back_camera")
    private String backCamera;
    @Column(name = "screen_touch")
    private String screenTouch;
    @Column(name = "screen_tech")
    private String screenTech;
    @Column(name = "screen_resolution")
    private String screenResolution;
    @Column(name = "max_brightness")
    private String maxBrightness;
    @Column(name = "back_camera_tech")
    private String backCameraTech;
    @Column(name = "back_camera_record")
    private String backCameraRecord;

    // Connection
    @Column(name = "mobile_network")
    private String mobileNetwork;
    @Column(name = "bluetooth")
    private String bluetooth;
    @Column(name = "sim")
    private String sim;
    @Column(name = "wifi")
    private String wifi;
    @Column(name = "gps")
    private String gps;
    @Column(name = "charge_port")
    private String chargePort;
    @Column(name = "earphone_port")
    private String earphonePort;
    @Column(name = "another_port")
    private String anotherPort;

    //  Design Material
    @Column(name = "design")
    private String design;
    @Column(name = "material" )
    private String material;
    @Column(name = "dimension" )
    private String dimension;
    @Column(name = "release_year")
    private int releaseYear;

    // Utilities
    @Column(name = "music_util")
    private String musicUtil;
    @Column(name = "movie_util")
    private String movieUtil;
    @Column(name = "record_util")
    private String recordUtil;
    @Column(name = "resistance_util")
    private String resistanceUtil;
    @Column(name = "special_util")
    private String specialUtil;
    @Column(name = "advanced_util")
    private String advancedUtil;


}
