package com.example.demo.model.product;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Blob;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "product_image")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;     // Tên file ảnh (tuỳ chọn)
    private String fileType;     // Kiểu MIME, ví dụ: image/jpeg

    private String imageUrl;     // Đường dẫn ảnh (URL đầy đủ)

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}

