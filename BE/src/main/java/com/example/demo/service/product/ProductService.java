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

        // Map list of options
        List<Map<String, Object>> optionRows = (List<Map<String, Object>>) row.get("options");
        if (optionRows != null) {
            List<ProductOptionResponse> options = optionRows.stream().map(opt -> {
                ProductOptionResponse option = new ProductOptionResponse();
                option.setId((Long) opt.get("option_id"));
                option.setRam(opt.get("ram") != null ? ((Number) opt.get("ram")).intValue() : null);
                option.setRom(opt.get("rom") != null ? ((Number) opt.get("rom")).intValue() : null);
                option.setPrice((BigDecimal) opt.get("price"));
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
        String productSql = """
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
            o.id AS option_id
        FROM product p
        LEFT JOIN product_category c ON p.category_id = c.id
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

        String orderBy = Boolean.TRUE.equals(filter.getSortByNewest())
                ? " ORDER BY p.update_at DESC"
                : " ORDER BY p.id ASC";

        String fullProductSql = productSql + where + orderBy + " LIMIT :limit OFFSET :offset";

        String countSql = """
        SELECT COUNT(DISTINCT p.id)
        FROM product p
        JOIN product_category c ON p.category_id = c.id
        LEFT JOIN product_option o ON o.product_id = p.id
        WHERE 1=1
    """ + where;

        Query productQuery = entityManager.createNativeQuery(fullProductSql);
        Query countQuery = entityManager.createNativeQuery(countSql);

        productParams.forEach((k, v) -> {
            productQuery.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        productQuery.setParameter("limit", size);
        productQuery.setParameter("offset", page * size);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = productQuery.getResultList();

        // Gom theo productId
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
                return map;
            });

            List<Map<String, Object>> options = (List<Map<String, Object>>) productMap.get("options");
            if (row[10] != null) { // nếu option_id có
                Map<String, Object> option = new HashMap<>();
                option.put("option_id", row[10]);
                option.put("ram", row[6]);
                option.put("rom", row[7]);
                option.put("color_name", row[8]);
                option.put("price", row[9]);
                options.add(option);
            }
        }

        Long total = ((Number) countQuery.getSingleResult()).longValue();

        Map<String, Object> response = new HashMap<>();
        response.put("content", convertToFilterResponses(new ArrayList<>(grouped.values())));
        response.put("page", page);
        response.put("size", size);
        response.put("totalElements", total);
        response.put("totalPages", (int) Math.ceil((double) total / size));

        return response;
    }



    @Override
    public Map<String, Object> filterAdminProducts(ProductFilterRequest filter, int page, int size) {
        String productSql = """
        SELECT p.id,
               p.name,
               p.screen_dimension,
               p.screen_tech,
               p.screen_resolution,
               c.id AS category_id,
               c.name AS category_name,
               o.color_name,
               o.ram,
               o.rom,
               o.price,
               o.id AS option_id
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

        String orderBy = Boolean.TRUE.equals(filter.getSortByNewest())
                ? " ORDER BY p.update_at DESC"
                : " ORDER BY p.id ASC";

        String fullProductSql = productSql + where + orderBy + " LIMIT :limit OFFSET :offset";

        String countSql = """
        SELECT COUNT(DISTINCT p.id)
        FROM product p
        JOIN product_category c ON p.category_id = c.id
        LEFT JOIN product_option o ON o.product_id = p.id
        WHERE 1=1
    """ + where;

        Query productQuery = entityManager.createNativeQuery(fullProductSql);
        Query countQuery = entityManager.createNativeQuery(countSql);

        productParams.forEach((k, v) -> {
            productQuery.setParameter(k, v);
            countQuery.setParameter(k, v);
        });

        productQuery.setParameter("limit", size);
        productQuery.setParameter("offset", page * size);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = productQuery.getResultList();

        // Grouping by productId
        Map<Long, Map<String, Object>> grouped = new LinkedHashMap<>();

        for (Object[] row : rows) {
            Long productId = ((Number) row[0]).longValue();

            // Nếu chưa tồn tại, tạo mới product map
            Map<String, Object> productMap = grouped.computeIfAbsent(productId, id -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", row[0]);
                map.put("name", row[1]);
                map.put("screen_dimension", row[2]);
                map.put("screen_tech", row[3]);
                map.put("screen_resolution", row[4]);
                map.put("category_id", row[5]);
                map.put("category_name", row[6]);
                map.put("options", new ArrayList<Map<String, Object>>());
                return map;
            });

            // Gộp option
            List<Map<String, Object>> options = (List<Map<String, Object>>) productMap.get("options");
            if (row[11] != null) { // nếu có option_id thì mới add
                Map<String, Object> option = new HashMap<>();
                option.put("option_id", row[11]);
                option.put("color_name", row[7]);
                option.put("ram", row[8]);
                option.put("rom", row[9]);
                option.put("price", row[10]);
                options.add(option);
            }
        }

        Long total = ((Number) countQuery.getSingleResult()).longValue();

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

        if (request.getProductId() == null || request.getProductId().isEmpty()) {
            result.put("data", Collections.emptyList());
            result.put("message", "No product IDs provided");
            return result;
        }

        // Tạo placeholders: (?, ?, ?, ...)
        String placeholders = request.getProductId().stream()
                .map(id -> "?")
                .collect(Collectors.joining(", "));

        String compareSql = """
        SELECT 
            p.*,
            op.id AS option_id,
            op.ram,
            op.rom,
            op.price,
            op.color_name
        FROM product p
        JOIN product_option op ON op.product_id = p.id
        WHERE p.id IN (%s)
    """.formatted(placeholders);

        List<Map<String, Object>> products = jdbcTemplate.queryForList(compareSql, request.getProductId().toArray());

        result.put("data", products);
        result.put("total", products.size());
        return result;
    }


    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
    }

    public List<String> getAllBrand(){
        return productRepository.findAllDistinctBrands();
    }

}
