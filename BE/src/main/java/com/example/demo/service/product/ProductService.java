package com.example.demo.service.product;

import com.example.demo.dto.request.CompareRequest;
import com.example.demo.dto.request.ProductFilterRequest;
import com.example.demo.dto.request.products.CreateProductRequest;
import com.example.demo.dto.request.products.UpdateProductRequest;
import com.example.demo.dto.response.product.*;
import com.example.demo.enums.ColorName;
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
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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

    private final JdbcTemplate jdbcTemplate;

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
    public ProductFilterResponse convertFilterResponse(Map<String, Object> row) {
        ProductFilterResponse response = new ProductFilterResponse();

        response.setId(((Number) row.get("id")).longValue());
        response.setName((String) row.get("name"));
        response.setScreenResolution((String) row.get("screen_resolution"));
        response.setScreenDimension((String) row.get("screen_dimension"));
        response.setScreenTech((String) row.get("screen_tech"));

        // Map category
        CategoryResponse category = new CategoryResponse();
        category.setId((Long) row.get("category_id"));
        category.setName((String) row.get("category_name"));
        response.setCategory(category);
        response.setBrand((String) row.get("brand"));
        response.setReleaseYear((int) row.get("release_year"));
        response.setStatus((ProductStatus) row.get("product_status"));


        Map<String, Object> imageMap = (Map<String, Object>) row.get("image");
        if (imageMap != null) {
            ProductImageResponse image = new ProductImageResponse();
            image.setId(imageMap.get("image_id") != null ? ((Number) imageMap.get("image_id")).longValue() : null);
            image.setFileName((String) imageMap.get("file_name"));
            image.setFileType((String) imageMap.get("file_type"));
            image.setImageUrl((String) imageMap.get("image_url"));
            response.setImage(image);
        } else {
            response.setImage(null);
        }


        // Map list of options
        List<Map<String, Object>> optionRows = (List<Map<String, Object>>) row.get("options");
        if (optionRows != null) {
            List<ProductOptionResponse> options = optionRows.stream().map(opt -> {
                ProductOptionResponse option = new ProductOptionResponse();
                option.setId((Long) opt.get("option_id"));
                option.setRam(opt.get("ram") != null ? ((Number) opt.get("ram")).intValue() : null);
                option.setRom(opt.get("rom") != null ? ((Number) opt.get("rom")).intValue() : null);
                option.setPrice((BigDecimal) opt.get("price"));
                option.setRemainingQuantity((int) opt.get("remaining_quantity"));
                option.setColorName(
                        Optional.ofNullable((String) opt.get("color_name"))
                                .map(ColorName::valueOf)
                                .orElse(null)
                );
                return option;
            }).toList();

            response.setOption(options);
        } else {
            response.setOption(Collections.emptyList());
        }

        return response;
    }

    @Override
    public List<ProductFilterResponse> convertToFilterResponses(List<Map<String, Object>> rows) {
        return rows.stream().map(this::convertFilterResponse).toList();
    }

    @Override
    public Map<String, Object> filterProducts(ProductFilterRequest filter, int page, int size) {
        // 1. Query đếm tổng số sản phẩm
        String countSql = """
                SELECT COUNT(DISTINCT p.id)
                FROM product p
                JOIN product_category c ON p.category_id = c.id
                LEFT JOIN product_option o ON o.product_id = p.id
                WHERE 1=1
                """;

        // 2. Xây dựng mệnh đề WHERE
        StringBuilder where = new StringBuilder();
        Map<String, Object> params = new HashMap<>();

        if (filter.getCategoryName() != null && !filter.getCategoryName().isEmpty()) {
            where.append(" AND c.name IN :categoryNames");
            params.put("categoryNames", filter.getCategoryName());
        }
        if (filter.getBrand() != null && !filter.getBrand().isEmpty()) {
            where.append(" AND p.brand IN :brands");
            params.put("brands", filter.getBrand());
        }
        if (filter.getOs() != null && !filter.getOs().isEmpty()) {
            where.append(" AND p.os IN :osList");
            params.put("osList", filter.getOs());
        }
        if (filter.getScreenResolution() != null && !filter.getScreenResolution().isEmpty()) {
            where.append(" AND p.screen_resolution IN :resolutions");
            params.put("resolutions", filter.getScreenResolution());
        }
        if (filter.getRam() != null && !filter.getRam().isEmpty()) {
            where.append(" AND o.ram IN :rams");
            params.put("rams", filter.getRam());
        }
        if (filter.getRom() != null && !filter.getRom().isEmpty()) {
            where.append(" AND o.rom IN :roms");
            params.put("roms", filter.getRom());
        }
        if (filter.getMinPrice() != null) {
            where.append(" AND o.price >= :minPrice");
            params.put("minPrice", filter.getMinPrice());
        }
        if (filter.getMaxPrice() != null) {
            where.append(" AND o.price <= :maxPrice");
            params.put("maxPrice", filter.getMaxPrice());
        }

        String orderBy = Boolean.TRUE.equals(filter.getSortByNewest())
                ? " ORDER BY p.update_at DESC"
                : " ORDER BY p.id ASC";

        // 3. Thực hiện query đếm
        Query countQuery = entityManager.createNativeQuery(countSql + where);
        params.forEach(countQuery::setParameter);
        Long total = ((Number) countQuery.getSingleResult()).longValue();

        // 4. Nếu không có sản phẩm, trả về kết quả rỗng
        if (total == 0) {
            return createEmptyResponse(page, size);
        }

        // 5. Query lấy ID sản phẩm với cách tiếp cận an toàn
        String productIdSql;
        boolean isNewestSort = Boolean.TRUE.equals(filter.getSortByNewest());

        if (isNewestSort) {
            // Sử dụng subquery để đảm bảo hiệu suất và tuân thủ ONLY_FULL_GROUP_BY
            productIdSql = """
                    SELECT p.id, p.category_id FROM (
                        SELECT id, category_id FROM product
                        WHERE 1=1
                        ORDER BY update_at DESC
                        LIMIT :limit OFFSET :offset
                    ) p
                    JOIN product_category c ON p.category_id = c.id
                    LEFT JOIN product_option o ON o.product_id = p.id
                    WHERE 1=1
                    """ + where;
        } else {
            productIdSql = """
                    SELECT DISTINCT p.id
                    FROM product p
                    JOIN product_category c ON p.category_id = c.id
                    LEFT JOIN product_option o ON o.product_id = p.id
                    WHERE 1=1
                    """ + where + " ORDER BY p.id ASC LIMIT :limit OFFSET :offset";
        }

        // 6. Thực hiện query lấy ID sản phẩm
        Query productIdQuery = entityManager.createNativeQuery(productIdSql);
        params.forEach(productIdQuery::setParameter);
        productIdQuery.setParameter("limit", size);
        productIdQuery.setParameter("offset", page * size);

        // Xử lý kết quả an toàn
        @SuppressWarnings("unchecked")
        List<Long> productIds = ((List<Object>) productIdQuery.getResultList()).stream()
                .map(result -> {
                    if (result instanceof Number) {
                        return ((Number) result).longValue();
                    } else if (result instanceof Object[]) {
                        Object[] row = (Object[]) result;
                        if (row.length > 0 && row[0] instanceof Number) {
                            return ((Number) row[0]).longValue();
                        }
                    }
                    throw new IllegalStateException("Unexpected result type: " +
                            (result != null ? result.getClass().getName() : "null"));
                })
                .collect(Collectors.toList());
        // 7. Nếu không có sản phẩm trong trang hiện tại
        if (productIds.isEmpty()) {
            return createEmptyResponse(page, size);
        }

        // 8. Query lấy chi tiết sản phẩm với các ID đã lọc
        String productDetailSql = """
                SELECT 
                    p.id,
                    p.name,
                    p.screen_resolution,
                    p.screen_dimension,
                    p.screen_tech,
                    c.name AS category_name,
                    o.ram,
                    o.rom,
                    o.color_name,
                    o.price,
                    o.id AS option_id,
                    p.brand,
                    p.product_status,
                    p.release_year,
                    o.remaining_quantity,
                    i.id AS image_id,
                        i.file_name,
                        i.file_type,
                        i.image_url
                FROM product p
                LEFT JOIN product_category c ON p.category_id = c.id
                LEFT JOIN product_option o ON o.product_id = p.id
                LEFT JOIN (
                    SELECT *
                    FROM product_image
                    WHERE id IN (
                        SELECT MIN(id)
                        FROM product_image
                        GROUP BY product_id
                    )
                ) i ON i.product_id = p.id
                WHERE p.id IN :productIds
                ORDER BY 
                    CASE WHEN :sortNewest THEN p.update_at ELSE p.id END DESC,
                    p.id, o.id
                """;

        Query productQuery = entityManager.createNativeQuery(productDetailSql);
        productQuery.setParameter("productIds", productIds);
        productQuery.setParameter("sortNewest", isNewestSort);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = productQuery.getResultList();

        // 9. Gom nhóm kết quả
        Map<Long, Map<String, Object>> grouped = new LinkedHashMap<>();
        for (Object[] row : rows) {
            Long productId = ((Number) row[0]).longValue();
            Map<String, Object> productMap = grouped.computeIfAbsent(productId, id -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", row[0]);
                map.put("name", row[1]);
                map.put("screen_resolution", row[2]);
                map.put("screen_dimension", row[3]);
                map.put("screen_tech", row[4]);
                map.put("category_name", row[5]);
                map.put("options", new ArrayList<Map<String, Object>>());
                map.put("brand", row[11]);
                ProductStatus status = null;
                if (row[12] != null) { // replace x with the correct column index
                    if (row[12] instanceof ProductStatus) {
                        status = (ProductStatus) row[12];
                    } else if (row[12] instanceof String) {
                        status = ProductStatus.fromString((String) row[12]);
                    }
                    // Handle other cases if needed
                }
                map.put("product_status", status);
                map.put("release_year", row[13]);
                if (row[15] != null) {
                    Map<String, Object> imageMap = new HashMap<>();
                    imageMap.put("image_id", row[15]);
                    imageMap.put("file_name", row[16]);
                    imageMap.put("file_type", row[17]);
                    imageMap.put("image_url", row[18]);
                    map.put("image", imageMap);
                } else {
                    map.put("image", null); // hoặc không put gì cả, tùy ý
                }

                return map;
            });




            List<Map<String, Object>> options = (List<Map<String, Object>>) productMap.get("options");
            if (row[10] != null) {
                Map<String, Object> option = new HashMap<>();
                option.put("option_id", row[10]);
                option.put("ram", row[6]);
                option.put("rom", row[7]);
                option.put("color_name", row[8]);
                option.put("price", row[9]);
                option.put("remaining_quantity", row[14]);
                options.add(option);
            }
        }

        // 10. Tạo response
        Map<String, Object> response = new HashMap<>();
        response.put("content", convertToFilterResponses(new ArrayList<>(grouped.values())));
        response.put("page", page);
        response.put("size", size);
        response.put("totalElements", total);
        response.put("totalPages", (int) Math.ceil((double) total / size));

        return response;
    }

    private Map<String, Object> createEmptyResponse(int page, int size) {
        Map<String, Object> response = new HashMap<>();
        response.put("content", Collections.emptyList());
        response.put("page", page);
        response.put("size", size);
        response.put("totalElements", 0);
        response.put("totalPages", 0);
        return response;
    }


    @Override
    public Map<String, Object> filterAdminProducts(ProductFilterRequest filter, int page, int size) {
        // 1. Query đếm tổng số sản phẩm
        String countSql = """
                SELECT COUNT(DISTINCT p.id)
                FROM product p
                JOIN product_category c ON p.category_id = c.id
                LEFT JOIN product_option o ON o.product_id = p.id
                WHERE 1=1
                """;

        // 2. Xây dựng mệnh đề WHERE
        StringBuilder where = new StringBuilder();
        Map<String, Object> params = new HashMap<>();

        if (filter.getCategoryName() != null && !filter.getCategoryName().isEmpty()) {
            where.append(" AND c.name IN :categoryNames");
            params.put("categoryNames", filter.getCategoryName());
        }
        if (filter.getBrand() != null && !filter.getBrand().isEmpty()) {
            where.append(" AND p.brand IN :brands");
            params.put("brands", filter.getBrand());
        }
        if (filter.getOs() != null && !filter.getOs().isEmpty()) {
            where.append(" AND p.os IN :osList");
            params.put("osList", filter.getOs());
        }
        if (filter.getScreenResolution() != null && !filter.getScreenResolution().isEmpty()) {
            where.append(" AND p.screen_resolution IN :resolutions");
            params.put("resolutions", filter.getScreenResolution());
        }
        if (filter.getRam() != null && !filter.getRam().isEmpty()) {
            where.append(" AND o.ram IN :rams");
            params.put("rams", filter.getRam());
        }
        if (filter.getRom() != null && !filter.getRom().isEmpty()) {
            where.append(" AND o.rom IN :roms");
            params.put("roms", filter.getRom());
        }
        if (filter.getMinPrice() != null) {
            where.append(" AND o.price >= :minPrice");
            params.put("minPrice", filter.getMinPrice());
        }
        if (filter.getMaxPrice() != null) {
            where.append(" AND o.price <= :maxPrice");
            params.put("maxPrice", filter.getMaxPrice());
        }

        String orderBy = Boolean.TRUE.equals(filter.getSortByNewest())
                ? " ORDER BY p.update_at DESC"
                : " ORDER BY p.id ASC";

        // 3. Thực hiện query đếm
        Query countQuery = entityManager.createNativeQuery(countSql + where);
        params.forEach(countQuery::setParameter);
        Long total = ((Number) countQuery.getSingleResult()).longValue();

        // 4. Nếu không có sản phẩm, trả về kết quả rỗng
        if (total == 0) {
            return createEmptyResponse(page, size);
        }

        // 5. Query lấy ID sản phẩm với cách tiếp cận an toàn
        String productIdSql;
        boolean isNewestSort = Boolean.TRUE.equals(filter.getSortByNewest());

        if (isNewestSort) {
            // Sử dụng subquery để đảm bảo hiệu suất và tuân thủ ONLY_FULL_GROUP_BY
            productIdSql = """
                    SELECT p.id, p.category_id FROM (
                        SELECT id, category_id FROM product
                        WHERE 1=1
                        ORDER BY update_at DESC
                        LIMIT :limit OFFSET :offset
                    ) p
                    JOIN product_category c ON p.category_id = c.id
                    LEFT JOIN product_option o ON o.product_id = p.id
                    WHERE 1=1
                    """ + where;
        } else {
            productIdSql = """
                    SELECT DISTINCT p.id
                    FROM product p
                    JOIN product_category c ON p.category_id = c.id
                    LEFT JOIN product_option o ON o.product_id = p.id
                    WHERE 1=1
                    """ + where + " ORDER BY p.id ASC LIMIT :limit OFFSET :offset";
        }

        // 6. Thực hiện query lấy ID sản phẩm
        Query productIdQuery = entityManager.createNativeQuery(productIdSql);
        params.forEach(productIdQuery::setParameter);
        productIdQuery.setParameter("limit", size);
        productIdQuery.setParameter("offset", page * size);

        // Xử lý kết quả an toàn
        @SuppressWarnings("unchecked")
        List<Long> productIds = ((List<Object>) productIdQuery.getResultList()).stream()
                .map(result -> {
                    if (result instanceof Number) {
                        return ((Number) result).longValue();
                    } else if (result instanceof Object[]) {
                        Object[] row = (Object[]) result;
                        if (row.length > 0 && row[0] instanceof Number) {
                            return ((Number) row[0]).longValue();
                        }
                    }
                    throw new IllegalStateException("Unexpected result type: " +
                            (result != null ? result.getClass().getName() : "null"));
                })
                .collect(Collectors.toList());
        // 7. Nếu không có sản phẩm trong trang hiện tại
        if (productIds.isEmpty()) {
            return createEmptyResponse(page, size);
        }

        // 8. Query lấy chi tiết sản phẩm với các ID đã lọc
        String productDetailSql = """
                SELECT 
                    p.id,
                    p.name,
                    p.screen_resolution,
                    p.screen_dimension,
                    p.screen_tech,
                    c.name AS category_name,
                    o.ram,
                    o.rom,
                    o.color_name,
                    o.price,
                    o.id AS option_id,
                    p.brand,
                    p.product_status,
                    p.release_year,
                    o.remaining_quantity
                FROM product p
                LEFT JOIN product_category c ON p.category_id = c.id
                LEFT JOIN product_option o ON o.product_id = p.id
                WHERE p.id IN :productIds
                ORDER BY 
                    CASE WHEN :sortNewest THEN p.update_at ELSE p.id END DESC,
                    p.id, o.id
                """;

        Query productQuery = entityManager.createNativeQuery(productDetailSql);
        productQuery.setParameter("productIds", productIds);
        productQuery.setParameter("sortNewest", isNewestSort);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = productQuery.getResultList();

        // 9. Gom nhóm kết quả
        Map<Long, Map<String, Object>> grouped = new LinkedHashMap<>();
        for (Object[] row : rows) {
            Long productId = ((Number) row[0]).longValue();
            Map<String, Object> productMap = grouped.computeIfAbsent(productId, id -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", row[0]);
                map.put("name", row[1]);
                map.put("screen_resolution", row[2]);
                map.put("screen_dimension", row[3]);
                map.put("screen_tech", row[4]);
                map.put("category_name", row[5]);
                map.put("options", new ArrayList<Map<String, Object>>());
                map.put("brand", row[11]);

                ProductStatus status = null;
                if (row[12] != null) { // replace x with the correct column index
                    if (row[12] instanceof ProductStatus) {
                        status = (ProductStatus) row[12];
                    } else if (row[12] instanceof String) {
                        status = ProductStatus.fromString((String) row[12]);
                    }
                    // Handle other cases if needed
                }
                map.put("product_status", status);
                map.put("release_year", row[13]);
                return map;
            });

            List<Map<String, Object>> options = (List<Map<String, Object>>) productMap.get("options");
            if (row[10] != null) {
                Map<String, Object> option = new HashMap<>();
                option.put("option_id", row[10]);
                option.put("ram", row[6]);
                option.put("rom", row[7]);
                option.put("color_name", row[8]);
                option.put("price", row[9]);
                option.put("remaining_quantity", row[14]);
                options.add(option);
            }
        }

        // 10. Tạo response
        Map<String, Object> response = new HashMap<>();
        response.put("content", convertToFilterResponses(new ArrayList<>(grouped.values())));
        response.put("page", page);
        response.put("size", size);
        response.put("totalElements", total);
        response.put("totalPages", (int) Math.ceil((double) total / size));

        return response;
    }


    @Override
    public Map<String, Object> filterCompareProducts(CompareRequest request) {
        Map<String, Object> result = new HashMap<>();

        if (request.getProductOptionId() == null || request.getProductOptionId().isEmpty()) {
            result.put("data", Collections.emptyList());
            result.put("message", "No product IDs provided");
            return result;
        }

        String placeholders = request.getProductOptionId().stream()
                .map(id -> "?")
                .collect(Collectors.joining(", "));

        String sql = """
                    SELECT 
                        p.id, p.name, p.description, p.brand, p.product_status,
                        p.os, p.cpu, p.cpu_speed, p.gpu,
                        p.battery_capacity, p.battery_type, p.charge_support, p.battery_tech,
                        p.screen_dimension, p.flash, p.front_camera, p.back_camera,
                        p.screen_touch, p.screen_tech, p.screen_resolution, p.max_brightness,
                        p.back_camera_tech, p.back_camera_record,
                        p.mobile_network, p.bluetooth, p.sim, p.wifi, p.gps, 
                        p.charge_port, p.earphone_port, p.another_port,
                        p.design, p.material, p.dimension, p.release_year,
                        p.music_util, p.movie_util, p.record_util, p.resistance_util, 
                        p.special_util, p.advanced_util,
                        c.name as category_name,
                        op.id AS option_id, op.ram, op.rom, op.price, op.color_name,
                        i.id AS image_id,
                        i.file_name,
                        i.file_type,
                        i.image_url
                    FROM product_option op
                    LEFT JOIN product p ON op.product_id = p.id
                    LEFT JOIN product_category c ON p.category_id = c.id
                    LEFT JOIN (
                                                                        SELECT pi.*
                                                                        FROM product_image pi
                                                                        WHERE pi.id = (
                                                                            SELECT MIN(id)
                                                                            FROM product_image
                                                                            WHERE product_id = pi.product_id
                                                                        )
                                                                    ) i ON i.product_id = p.id
                    WHERE op.id IN (%s)
                """.formatted(placeholders);

        List<Object[]> rows = jdbcTemplate.query(sql, (rs, rowNum) -> new Object[]{
                rs.getLong("id"),
                rs.getString("name"),
                rs.getString("description"),
                rs.getString("brand"),
                rs.getString("product_status"),
                rs.getString("os"),
                rs.getString("cpu"),
                rs.getBigDecimal("cpu_speed"),
                rs.getString("gpu"),
                rs.getBigDecimal("battery_capacity"),
                rs.getString("battery_type"),
                rs.getString("charge_support"),
                rs.getString("battery_tech"),
                rs.getString("screen_dimension"),
                rs.getBoolean("flash"),
                rs.getString("front_camera"),
                rs.getString("back_camera"),
                rs.getString("screen_touch"),
                rs.getString("screen_tech"),
                rs.getString("screen_resolution"),
                rs.getString("max_brightness"),
                rs.getString("back_camera_tech"),
                rs.getString("back_camera_record"),
                rs.getString("mobile_network"),
                rs.getString("bluetooth"),
                rs.getString("sim"),
                rs.getString("wifi"),
                rs.getString("gps"),
                rs.getString("charge_port"),
                rs.getString("earphone_port"),
                rs.getString("another_port"),
                rs.getString("design"),
                rs.getString("material"),
                rs.getString("dimension"),
                rs.getInt("release_year"),
                rs.getString("music_util"),
                rs.getString("movie_util"),
                rs.getString("record_util"),
                rs.getString("resistance_util"),
                rs.getString("special_util"),
                rs.getString("advanced_util"),
                rs.getString("category_name"),
                rs.getLong("option_id"),
                rs.getString("ram"),
                rs.getString("rom"),
                rs.getBigDecimal("price"),
                rs.getString("color_name"),
                rs.getLong("image_id"),
                rs.getString("file_name"),
                rs.getString("file_type"),
                rs.getString("image_url")

        }, request.getProductOptionId().toArray());

        // Gom sản phẩm và options
        Map<Long, Map<String, Object>> grouped = new LinkedHashMap<>();

        for (Object[] row : rows) {
            Long productId = ((Number) row[0]).longValue();

            Map<String, Object> product = grouped.computeIfAbsent(productId, id -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", row[0]);
                map.put("name", row[1]);
                map.put("description", row[2]);
                map.put("brand", row[3]);
                map.put("product_status", row[4]);
                map.put("os", row[5]);
                map.put("cpu", row[6]);
                map.put("cpu_speed", row[7]);
                map.put("gpu", row[8]);
                map.put("battery_capacity", row[9]);
                map.put("battery_type", row[10]);
                map.put("charge_support", row[11]);
                map.put("battery_tech", row[12]);
                map.put("screen_dimension", row[13]);
                map.put("flash", row[14]);
                map.put("front_camera", row[15]);
                map.put("back_camera", row[16]);
                map.put("screen_touch", row[17]);
                map.put("screen_tech", row[18]);
                map.put("screen_resolution", row[19]);
                map.put("max_brightness", row[20]);
                map.put("back_camera_tech", row[21]);
                map.put("back_camera_record", row[22]);
                map.put("mobile_network", row[23]);
                map.put("bluetooth", row[24]);
                map.put("sim", row[25]);
                map.put("wifi", row[26]);
                map.put("gps", row[27]);
                map.put("charge_port", row[28]);
                map.put("earphone_port", row[29]);
                map.put("another_port", row[30]);
                map.put("design", row[31]);
                map.put("material", row[32]);
                map.put("dimension", row[33]);
                map.put("release_year", row[34]);
                map.put("music_util", row[35]);
                map.put("movie_util", row[36]);
                map.put("record_util", row[37]);
                map.put("resistance_util", row[38]);
                map.put("special_util", row[39]);
                map.put("advanced_util", row[40]);
                map.put("category_name", row[41]);
                map.put("options", new ArrayList<Map<String, Object>>());
                map.put("images", new ArrayList<Map<String, Object>>()); // 👈 thêm images
                return map;
            });

            // gom options
            List<Map<String, Object>> options = (List<Map<String, Object>>) product.get("options");
            if (row[42] != null) {
                Map<String, Object> option = new HashMap<>();
                option.put("option_id", row[42]);
                option.put("ram", row[43]);
                option.put("rom", row[44]);
                option.put("price", row[45]);
                option.put("color_name", row[46]);
                options.add(option);
            }

            // gom images
            List<Map<String, Object>> images = (List<Map<String, Object>>) product.get("images");
            if (row[47] != null) {
                Map<String, Object> image = new HashMap<>();
                image.put("id", row[47]);
                image.put("file_name", row[48]);
                image.put("file_type", row[49]);
                image.put("image_url", row[50]);
                images.add(image);
            }
        }


        result.put("data", new ArrayList<>(grouped.values()));
        result.put("total", grouped.size());
        return result;
    }


    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
    }

    public List<String> getAllBrand() {
        return productRepository.findAllDistinctBrands();
    }

}
