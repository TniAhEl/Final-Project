package com.example.demo.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class PaginationResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private int totalPages;

    public PaginationResponse(List<T> content, int page, int size, int totalPages) {
        this.content = content;
        this.page = page;
        this.size = size;
        this.totalPages = totalPages;
    }

    // Getters and setters
}

