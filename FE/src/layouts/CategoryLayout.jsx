import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import FilterBar from "../components/Sidebar/Filter";
import ProductCard from "../components/Card/Product";
import { filterProducts } from "../api/productService";

// Dữ liệu mẫu cho filter
const categories = ["Smartphone", "Tablet", "Feature Phone"];
const brands = ["Apple", "Samsung", "Xiaomi", "Oppo", "Realme"];
const rams = ["4GB", "6GB", "8GB", "12GB"];
const roms = ["64GB", "128GB", "256GB", "512GB"];

const PAGE_SIZE = 20;

const CategoryLayout = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentFilters, setCurrentFilters] = useState({});
  const footerRef = useRef(null);
  const [initialized, setInitialized] = useState(false);

  // Fetch products với filter (hoặc filter rỗng)
  const fetchFilteredProducts = async (filterObject, pageToFetch = 0) => {
    setLoading(true);
    setError(null);
    try {
      const result = await filterProducts(filterObject || {}, pageToFetch, PAGE_SIZE);
      const productList = result.content || [];
      setProducts(
        pageToFetch === 0 ? productList : [...products, ...productList]
      );
      setTotalPages(result.totalPages || 0);
      setTotalElements(result.totalElements || 0);
      if (productList.length < PAGE_SIZE) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      setError("Failed to load products.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Lần đầu mount: chỉ fetch nếu chưa nhận filter từ Brand.jsx
  useEffect(() => {
    if (!initialized && (!location.state || !location.state.filter)) {
      setProducts([]);
      setPage(0);
      setHasMore(true);
      fetchFilteredProducts({}, 0);
    }
    // eslint-disable-next-line
  }, [initialized, location.state]);

  // Khi mount, nếu có filter truyền từ Brand.jsx qua location.state, ưu tiên filter này
  useEffect(() => {
    if (location.state && location.state.filter && !initialized) {
      let filter = location.state.filter;
      // Nếu filter có key 'brands', đổi thành 'brand' (số ít)
      if (filter.brands) {
        filter = { brand: filter.brands };
      }
      console.log('Filter from Brand.jsx:', filter);
      setCurrentFilters(filter);
      setProducts([]);
      setPage(0);
      setHasMore(true);
      fetchFilteredProducts(filter, 0);
      setInitialized(true);
    }
    // eslint-disable-next-line
  }, [location.state, initialized]);

  // Gọi fetchFilteredProducts mỗi khi page thay đổi, nhưng bỏ qua lần đầu nếu page=0 đã được fetch ở trên
  useEffect(() => {
    if (page === 0) return; // đã fetch ở trên
    fetchFilteredProducts(currentFilters, page);
    // eslint-disable-next-line
  }, [page]);

  // Khi filter thay đổi, reset page về 0 và fetch lại sản phẩm
  useEffect(() => {
    if (initialized) {
      setPage(0);
      fetchFilteredProducts(currentFilters, 0);
    }
    // eslint-disable-next-line
  }, [currentFilters]);

  // Lazy load: khi scroll đến cuối trang thì tăng page
  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 2
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line
  }, [loading, hasMore]);

  // Thêm useEffect log products
  useEffect(() => {
    if (products.length > 0) {
      console.log("All products after fetch:", products);
    }
  }, [products]);

  // Nhận filter object từ FilterBar
  const handleFilterChange = (filterObject) => {
    // Chuyển đổi filterObject: loại bỏ undefined/null, ép kiểu về string hoặc mảng string
    const cleanFilter = {};
    Object.entries(filterObject).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          cleanFilter[key] = value.map(v => v.toString());
        } else {
          cleanFilter[key] = value.toString();
        }
      }
    });
    setCurrentFilters(cleanFilter);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {/* Filter Bar ở phía trên */}

      {/* Nội dung chính */}
      <div className="flex-1 p-8">
        {/* Container với chiều rộng tối đa */}
        <div className="max-w-[1320px] mx-auto">
          <FilterBar
            categories={categories}
            brands={brands}
            rams={rams}
            roms={roms}
            minPrice={0}
            maxPrice={50000000}
            onFilterChange={handleFilterChange}
          />
          {/* Thông tin kết quả */}
          {products.length > 0 && (
            <div className="mb-6 text-sm text-gray-600">
              Hiển thị {products.length} sản phẩm
              {totalElements > 0 && ` (tổng cộng ${totalElements} sản phẩm)`}
            </div>
          )}

          {/* Lưới sản phẩm */}
          {products.length === 0 && loading ? (
            <div className="text-center text-gray-500 py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              Loading products...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">📦</div>
              Không có sản phẩm nào
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {products
                  .filter(product => {
                    // Tính tổng remainingQuantity của tất cả option > 0
                    if (!Array.isArray(product.option)) return false;
                    const totalRemain = product.option
                      .filter(opt => opt.remainingQuantity > 0)
                      .reduce((sum, opt) => sum + (opt.remainingQuantity || 0), 0);
                    return totalRemain > 0;
                  })
                  .map((product, idx) => (
                    <ProductCard
                      key={product.id || idx}
                      {...product}
                      option={Array.isArray(product.option) ? product.option.filter(opt => opt.remainingQuantity > 0) : []}
                    />
                  ))}
              </div>

              {/* Footer để detect scroll */}
              <div ref={footerRef} className="h-8"></div>

              {loading && (
                <div className="text-center text-gray-500 py-4">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading more...
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <div className="text-center text-gray-400 py-4">
                  Đã hiển thị tất cả sản phẩm
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryLayout;
