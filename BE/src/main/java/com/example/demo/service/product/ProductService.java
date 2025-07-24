package com.example.demo.service.product;

import com.example.demo.dto.request.ProductFilterRequest;
import com.example.demo.dto.request.products.CreateProductRequest;
import com.example.demo.dto.request.products.UpdateProductRequest;
import com.example.demo.dto.response.product.*;
import com.example.demo.enums.ProductStatus;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.product.*;
import com.example.demo.model.utilities.Warranty;
import com.example.demo.repository.product.*;
import com.example.demo.repository.utilities.WarrantyRepository;
import com.example.demo.service.impl.product.IProductService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductCategoryRepository productCategoryRepository;
    private final WarrantyRepository warrantyRepository;
    private final ModelMapper modelMapper;
    private final ProductOptionRepository productOptionRepository;

    @PersistenceContext
    private EntityManager entityManager;
    private final StoreRepository storeRepository;


    // sử lại filter product, lọc theo ngày cập nhật, lọc theo số lượng đã bán


    @Override
    @Transactional
    public Product createProduct(CreateProductRequest request) {
        Optional<Product> existingProduct = productRepository.findByName(request.getName());
        if (existingProduct.isPresent()) {
            throw new IllegalArgumentException("Product exists with name: " + request.getName());
        }

        // Lấy category từ categoryId trong request
        ProductCategory category = productCategoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        // Lấy warranty từ warrantyId trong request
        Warranty warranty = warrantyRepository.findById(request.getWarrantyId()).orElseThrow(() -> new ResourceNotFoundException("Warranty not found with id: " + request.getWarrantyId()));


        Product product = buildProductFromRequest(request, category, warranty);

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(UpdateProductRequest request, Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        ProductCategory category = productCategoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        Warranty warranty = warrantyRepository.findById(request.getWarrantyId()).orElseThrow(() -> new ResourceNotFoundException("Warranty not found with id: " + request.getWarrantyId()));

        Product saveProduct = buildUpdateProductFromRequest(request, category, warranty, product);
        return productRepository.save(saveProduct);
    }

    private Product buildUpdateProductFromRequest(UpdateProductRequest request, ProductCategory category, Warranty warranty, Product product) {
        // basic
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand());
        product.setProductStatus(request.getStatus());
        product.setCreateAt(LocalDateTime.now());
        product.setUpdateAt(LocalDateTime.now());
        product.setProductCategory(category);
        product.setWarranty(warranty);

        // Config
        product.setOs(request.getOs());
        product.setCpu(request.getCpu());
        product.setCpuSpeed(request.getCpuSpeed());
        product.setGpu(request.getGpu());

        // battery
        product.setBatteryCapacity(request.getBatteryCapacity());
        product.setBatteryType(request.getBatteryType());
        product.setChargeSupport(request.getChargeSupport());
        product.setBatteryTech(request.getBatteryTech());

        // camera screen
        product.setScreenDimension(request.getScreenDimension());
        product.setFlash(request.isFlash());
        product.setFrontCamera(request.getFrontCamera());
        product.setBackCamera(request.getBackCamera());
        product.setScreenTouch(request.getScreenTouch());
        product.setScreenTech(request.getScreenTech());
        product.setScreenResolution(request.getScreenResolution());
        product.setMaxBrightness(request.getMaxBrightness());
        product.setBackCameraTech(request.getBackCameraTech());
        product.setBackCameraRecord(request.getBackCameraRecord());

        // Connection
        product.setMobileNetwork(request.getMobileNetwork());
        product.setBluetooth(request.getBluetooth());
        product.setSim(request.getSim());
        product.setWifi(request.getWifi());
        product.setGps(request.getGps());
        product.setChargePort(request.getChargePort());
        product.setEarphonePort(request.getEarphonePort());
        product.setAnotherPort(request.getAnotherPort());

        // Design
        product.setDesign(request.getDesign());
        product.setMaterial(request.getMaterial());
        product.setDimension(request.getDimension());
        product.setReleaseYear(request.getReleaseYear());

        // utilities
        product.setMusicUtil(request.getMusicUtil());
        product.setMovieUtil(request.getMovieUtil());
        product.setRecordUtil(request.getRecordUtil());
        product.setResistanceUtil(request.getResistanceUtil());
        product.setSpecialUtil(request.getSpecialUtil());
        product.setAdvancedUtil(request.getAdvancedUtil());

        return product;
    }

    private Product buildProductFromRequest(CreateProductRequest request, ProductCategory category, Warranty warranty) {
        Product product = new Product();

        // basic
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand());
        product.setProductStatus(ProductStatus.DRAFT);
        product.setCreateAt(LocalDateTime.now());
        product.setUpdateAt(LocalDateTime.now());
        product.setProductCategory(category);
        product.setWarranty(warranty);

        // Config
        product.setOs(request.getOs());
        product.setCpu(request.getCpu());
        product.setCpuSpeed(request.getCpuSpeed());
        product.setGpu(request.getGpu());

        // battery
        product.setBatteryCapacity(request.getBatteryCapacity());
        product.setBatteryType(request.getBatteryType());
        product.setChargeSupport(request.getChargeSupport());
        product.setBatteryTech(request.getBatteryTech());

        // camera screen
        product.setScreenDimension(request.getScreenDimension());
        product.setFlash(request.isFlash());
        product.setFrontCamera(request.getFrontCamera());
        product.setBackCamera(request.getBackCamera());
        product.setScreenTouch(request.getScreenTouch());
        product.setScreenTech(request.getScreenTech());
        product.setScreenResolution(request.getScreenResolution());
        product.setMaxBrightness(request.getMaxBrightness());
        product.setBackCameraTech(request.getBackCameraTech());
        product.setBackCameraRecord(request.getBackCameraRecord());

        // Connection
        product.setMobileNetwork(request.getMobileNetwork());
        product.setBluetooth(request.getBluetooth());
        product.setSim(request.getSim());
        product.setWifi(request.getWifi());
        product.setGps(request.getGps());
        product.setChargePort(request.getChargePort());
        product.setEarphonePort(request.getEarphonePort());
        product.setAnotherPort(request.getAnotherPort());

        // Design
        product.setDesign(request.getDesign());
        product.setMaterial(request.getMaterial());
        product.setDimension(request.getDimension());
        product.setReleaseYear(request.getReleaseYear());

        // utilities
        product.setMusicUtil(request.getMusicUtil());
        product.setMovieUtil(request.getMovieUtil());
        product.setRecordUtil(request.getRecordUtil());
        product.setResistanceUtil(request.getResistanceUtil());
        product.setSpecialUtil(request.getSpecialUtil());
        product.setAdvancedUtil(request.getAdvancedUtil());

        return product;
    }

    @Override
    public ProductResponse convertToResponse(Product product) {
        ProductResponse productResponse = modelMapper.map(product, ProductResponse.class);

        // Map category to categoryResponse
        CategoryResponse categoryResponse = new CategoryResponse();
        categoryResponse.setId(productResponse.getCategory().getId());
        categoryResponse.setName(productResponse.getCategory().getName());

        // Map productOption to productOptionResponse
//        ProductOptionResponse productOptionResponse = new ProductOptionResponse();
//        productOptionResponse.setId(productResponse.getProductOption().getId());
//        productOptionResponse.setColorName(productResponse.getProductOption().getColorName());
//        productOptionResponse.setRam(productResponse.getProductOption().getRam());
//        productOptionResponse.setRom(productResponse.getProductOption().getRom());
//        productOptionResponse.setPrice(productResponse.getProductOption().getPrice());

        List<ProductImage> images = productImageRepository.findByProductId(product.getId());
        List<ProductImageResponse> imageDtos = images.stream().map(image -> modelMapper.map(image, ProductImageResponse.class)).toList();
        productResponse.setProductImageResponse(imageDtos);


        List<ProductOption> options = productOptionRepository.findByProductId(product.getId());
        List<ProductOptionResponse> optionResponses = options.stream().map(option -> modelMapper.map(option, ProductOptionResponse.class)).toList();
        productResponse.setOption(optionResponses);

        List<Store> stores = storeRepository.findAllByProductId(product.getId());
        List<StoreResponse> storeResponses = stores.stream().map(store -> modelMapper.map(store, StoreResponse.class)).toList();
        productResponse.setStores(storeResponses);

        return productResponse;
    }

    @Override
    public List<ProductResponse> convertToResponses(List<Product> products) {
        return products.stream().map(this::convertToResponse).toList();
    }


    @Override
    public Map<String, Object> filterProducts(ProductFilterRequest filter, int page, int size) {
        String productSql = """
        SELECT DISTINCT p.*
        FROM product p
        JOIN product_category c ON p.category_id = c.id
        JOIN product_option o ON o.product_id = p.id
        WHERE p.product_status != 'DRAFT' AND p.product_status != 'OUT_STOCK'
    """;

        StringBuilder where = new StringBuilder();
        Map<String, Object> productParams = new HashMap<>();

        if (filter.getCategoryName() != null && !filter.getCategoryName().isEmpty()) {
            where.append(" AND c.name IN :categoryNames");
            productParams.put("categoryNames", filter.getCategoryName());
        }
        if (filter.getBrand() != null && !filter.getBrand().isEmpty()) {
            where.append(" AND p.brand IN :brands");
            productParams.put("brands", filter.getBrand());
        }
        if (filter.getOs() != null && !filter.getOs().isEmpty()) {
            where.append(" AND p.os IN :osList");
            productParams.put("osList", filter.getOs());
        }
        if (filter.getScreenResolution() != null && !filter.getScreenResolution().isEmpty()) {
            where.append(" AND p.screen_resolution IN :resolutions");
            productParams.put("resolutions", filter.getScreenResolution());
        }
        if (filter.getRam() != null && !filter.getRam().isEmpty()) {
            where.append(" AND o.ram IN :rams");
            productParams.put("rams", filter.getRam());
        }
        if (filter.getRom() != null && !filter.getRom().isEmpty()) {
            where.append(" AND o.rom IN :roms");
            productParams.put("roms", filter.getRom());
        }
        if (filter.getMinPrice() != null) {
            where.append(" AND o.price >= :minPrice");
            productParams.put("minPrice", filter.getMinPrice());
        }
        if (filter.getMaxPrice() != null) {
            where.append(" AND o.price <= :maxPrice");
            productParams.put("maxPrice", filter.getMaxPrice());
        }

        String orderBy;
        if (Boolean.TRUE.equals(filter.getSortByNewest())) {
            orderBy = " ORDER BY p.update_at DESC";
        } else {
            orderBy = " ORDER BY p.id ASC";
        }


        String fullProductSql = productSql + where + orderBy + " LIMIT :limit OFFSET :offset";

        String countSql = """
        SELECT COUNT(DISTINCT p.id)
        FROM product p
        JOIN product_category c ON p.category_id = c.id
        JOIN product_option o ON o.product_id = p.id
        WHERE 1=1
    """ + where;

        Query productQuery = entityManager.createNativeQuery(fullProductSql, Product.class);
        Query countQuery = entityManager.createNativeQuery(countSql);

        productParams.forEach((k, v) -> {
            productQuery.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        productQuery.setParameter("limit", size);
        productQuery.setParameter("offset", page * size);

        @SuppressWarnings("unchecked")
        List<Product> products = productQuery.getResultList();

        // Lọc options nếu có sản phẩm
        if (!products.isEmpty()) {
            List<Long> productIds = products.stream().map(Product::getId).collect(Collectors.toList());

            String optionSql = "SELECT o FROM ProductOption o WHERE o.product.id IN :productIds";
            StringBuilder optionWhere = new StringBuilder();

            if (filter.getRam() != null && !filter.getRam().isEmpty()) {
                optionWhere.append(" AND o.ram IN :rams");
            }
            if (filter.getRom() != null && !filter.getRom().isEmpty()) {
                optionWhere.append(" AND o.rom IN :roms");
            }
            if (filter.getMinPrice() != null) {
                optionWhere.append(" AND o.price >= :minPrice");
            }
            if (filter.getMaxPrice() != null) {
                optionWhere.append(" AND o.price <= :maxPrice");
            }

            TypedQuery<ProductOption> optionQuery = entityManager.createQuery(optionSql + optionWhere, ProductOption.class);
            optionQuery.setParameter("productIds", productIds);

            if (filter.getRam() != null && !filter.getRam().isEmpty()) {
                optionQuery.setParameter("rams", filter.getRam());
            }
            if (filter.getRom() != null && !filter.getRom().isEmpty()) {
                optionQuery.setParameter("roms", filter.getRom());
            }
            if (filter.getMinPrice() != null) {
                optionQuery.setParameter("minPrice", filter.getMinPrice());
            }
            if (filter.getMaxPrice() != null) {
                optionQuery.setParameter("maxPrice", filter.getMaxPrice());
            }

            List<ProductOption> filteredOptions = optionQuery.getResultList();

            Map<Long, List<ProductOption>> optionsByProduct = filteredOptions.stream()
                    .collect(Collectors.groupingBy(option -> option.getProduct().getId()));

            for (Product product : products) {
                product.setProductOptions(optionsByProduct.getOrDefault(product.getId(), Collections.emptyList()));
            }
        }

        Long total = ((Number) countQuery.getSingleResult()).longValue();

        Map<String, Object> response = new HashMap<>();
        response.put("content", convertToResponses(products));
        response.put("page", page);
        response.put("size", size);
        response.put("totalElements", total);
        response.put("totalPages", (int) Math.ceil((double) total / size));

        return response;
    }



    @Override
    public Map<String, Object> filterAdminProducts(ProductFilterRequest filter, int page, int size) {
        String productSql = """
        SELECT DISTINCT p.*
        FROM product p
        JOIN product_category c ON p.category_id = c.id
        LEFT JOIN product_option o ON o.product_id = p.id
        WHERE 1=1
    """;

        StringBuilder where = new StringBuilder();
        Map<String, Object> productParams = new HashMap<>();

        if (filter.getCategoryName() != null && !filter.getCategoryName().isEmpty()) {
            where.append(" AND c.name IN :categoryNames");
            productParams.put("categoryNames", filter.getCategoryName());
        }
        if (filter.getBrand() != null && !filter.getBrand().isEmpty()) {
            where.append(" AND p.brand IN :brands");
            productParams.put("brands", filter.getBrand());
        }
        if (filter.getOs() != null && !filter.getOs().isEmpty()) {
            where.append(" AND p.os IN :osList");
            productParams.put("osList", filter.getOs());
        }
        if (filter.getScreenResolution() != null && !filter.getScreenResolution().isEmpty()) {
            where.append(" AND p.screen_resolution IN :resolutions");
            productParams.put("resolutions", filter.getScreenResolution());
        }
        if (filter.getRam() != null && !filter.getRam().isEmpty()) {
            where.append(" AND o.ram IN :rams");
            productParams.put("rams", filter.getRam());
        }
        if (filter.getRom() != null && !filter.getRom().isEmpty()) {
            where.append(" AND o.rom IN :roms");
            productParams.put("roms", filter.getRom());
        }
        if (filter.getMinPrice() != null) {
            where.append(" AND o.price >= :minPrice");
            productParams.put("minPrice", filter.getMinPrice());
        }
        if (filter.getMaxPrice() != null) {
            where.append(" AND o.price <= :maxPrice");
            productParams.put("maxPrice", filter.getMaxPrice());
        }

        String orderBy;
        if (Boolean.TRUE.equals(filter.getSortByNewest())) {
            orderBy = " ORDER BY p.update_at DESC";
        } else {
            orderBy = " ORDER BY p.id ASC";
        }

        String fullProductSql = productSql + where + orderBy + " LIMIT :limit OFFSET :offset";

        String countSql = """
        SELECT COUNT(DISTINCT p.id)
        FROM product p
        JOIN product_category c ON p.category_id = c.id
        LEFT JOIN product_option o ON o.product_id = p.id
        WHERE 1=1
    """ + where;

        Query productQuery = entityManager.createNativeQuery(fullProductSql, Product.class);
        Query countQuery = entityManager.createNativeQuery(countSql);

        productParams.forEach((k, v) -> {
            productQuery.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        productQuery.setParameter("limit", size);
        productQuery.setParameter("offset", page * size);

        @SuppressWarnings("unchecked")
        List<Product> products = productQuery.getResultList();

        // Lọc options nếu có sản phẩm
        if (!products.isEmpty()) {
            List<Long> productIds = products.stream().map(Product::getId).collect(Collectors.toList());

            String optionSql = "SELECT o FROM ProductOption o WHERE o.product.id IN :productIds";
            StringBuilder optionWhere = new StringBuilder();

            if (filter.getRam() != null && !filter.getRam().isEmpty()) {
                optionWhere.append(" AND o.ram IN :rams");
            }
            if (filter.getRom() != null && !filter.getRom().isEmpty()) {
                optionWhere.append(" AND o.rom IN :roms");
            }
            if (filter.getMinPrice() != null) {
                optionWhere.append(" AND o.price >= :minPrice");
            }
            if (filter.getMaxPrice() != null) {
                optionWhere.append(" AND o.price <= :maxPrice");
            }

            TypedQuery<ProductOption> optionQuery = entityManager.createQuery(optionSql + optionWhere, ProductOption.class);
            optionQuery.setParameter("productIds", productIds);

            if (filter.getRam() != null && !filter.getRam().isEmpty()) {
                optionQuery.setParameter("rams", filter.getRam());
            }
            if (filter.getRom() != null && !filter.getRom().isEmpty()) {
                optionQuery.setParameter("roms", filter.getRom());
            }
            if (filter.getMinPrice() != null) {
                optionQuery.setParameter("minPrice", filter.getMinPrice());
            }
            if (filter.getMaxPrice() != null) {
                optionQuery.setParameter("maxPrice", filter.getMaxPrice());
            }

            List<ProductOption> filteredOptions = optionQuery.getResultList();

            Map<Long, List<ProductOption>> optionsByProduct = filteredOptions.stream()
                    .collect(Collectors.groupingBy(option -> option.getProduct().getId()));

            for (Product product : products) {
                product.setProductOptions(optionsByProduct.getOrDefault(product.getId(), Collections.emptyList()));
            }
        }

        Long total = ((Number) countQuery.getSingleResult()).longValue();

        Map<String, Object> response = new HashMap<>();
        response.put("content", convertToResponses(products));
        response.put("page", page);
        response.put("size", size);
        response.put("totalElements", total);
        response.put("totalPages", (int) Math.ceil((double) total / size));

        return response;
    }



    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
    }

    public List<String> getAllBrand(){
        return productRepository.findAllDistinctBrands();
    }

}
