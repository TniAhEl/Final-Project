import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import FilterBar from "../components/Sidebar/Filter";
import ProductCard from "../components/Card/Product";
import { filterProducts } from "../api/productService";

// Dữ liệu mẫu cho filter
const categories = ["Smartphone", "Gaming Phone", "Feature Phone", "Foldable Phone", "Business Phone"];
const brands = ["Apple", "Samsung", "Xiaomi", "Oppo", "Realme", "Vivo", "OnePlus", "Nokia", ];
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
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [brandFilterApplied, setBrandFilterApplied] = useState(false); 
  const [isFiltering, setIsFiltering] = useState(false); 

  // Fetch products with filters
  const fetchFilteredProducts = async (filterObject, pageToFetch = 0) => {
    // If pageToFetch = 0 (), set isFiltering = true
    if (pageToFetch === 0) {
      setIsFiltering(true);
    }
    setLoading(true);
    setError(null);
    try {
      const result = await filterProducts(
        filterObject || {},
        pageToFetch,
        PAGE_SIZE
      );
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
      setIsFiltering(false); // Reset isFiltering after fetching
    }
  };

  // First mount: if there are filters from Brand.jsx, prioritize them, only apply once
  useEffect(() => {
    if (!initialized) {
      if (location.state && location.state.filter && !brandFilterApplied) {
        let filter = location.state.filter;
        if (filter.brands) {
          filter = { brand: filter.brands };
        }
        setCurrentFilters(filter);
        setProducts([]);
        setPage(0);
        setHasMore(true);
        fetchFilteredProducts(filter, 0);
        setBrandFilterApplied(true); // Set brand filter applied
        setInitialized(true);
        return;
      }
      // If no filter from Brand.jsx, fetch normally
      setProducts([]);
      setPage(0);
      setHasMore(true);
      fetchFilteredProducts({}, 0);
      setInitialized(true);
    }
    // eslint-disable-next-line
  }, [initialized, location.state, brandFilterApplied]);

  // When page changes (lazy load)
  useEffect(() => {
    if (page === 0) return;
    fetchFilteredProducts(currentFilters, page);
    // eslint-disable-next-line
  }, [page]);

  // When filters change (due to user actions), fetch products again but only after debounce is done
  useEffect(() => {
    if (initialized && !isDebouncing) {
      setPage(0);
      fetchFilteredProducts(currentFilters, 0);
    }
    // eslint-disable-next-line
  }, [currentFilters, isDebouncing]);

  // Lazy load: when scrolling to the bottom of the page, increase page
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

  // Add useEffect log products
  useEffect(() => {
    if (products.length > 0) {
    }
  }, [products]);

  // Receive filter object từ FilterBar
  const handleFilterChange = (filterObject) => {
    const cleanFilter = {};
    Object.entries(filterObject).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          if (key === 'ram' || key === 'rom') {
            cleanFilter[key] = value.map((v) => {
              const num = parseInt(v.toString().replace(/\D/g, ''));
              return isNaN(num) ? v.toString() : num;
            });
          } else {
            cleanFilter[key] = value.map((v) => v.toString());
          }
        } else {
          if (key === 'ram' || key === 'rom') {
            const num = parseInt(value.toString().replace(/\D/g, ''));
            cleanFilter[key] = isNaN(num) ? value.toString() : num;
          } else if (key === 'categoryName') {
            // Convert categoryName to array format
            cleanFilter[key] = [value.toString()];
          } else {
            cleanFilter[key] = value.toString();
          }
        }
      }
    });
    setCurrentFilters(cleanFilter);
  };

  const availableProducts = products.filter((product) => {
    if (!Array.isArray(product.option)) return false;
    const totalRemain = product.option
      .filter((opt) => opt.remainingQuantity > 0)
      .reduce((sum, opt) => sum + (opt.remainingQuantity || 0), 0);
    return totalRemain > 0;
  });

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">

      <div className="flex-1 p-8">
        <div className="max-w-[1320px] mx-auto">
          <FilterBar
            categories={categories}
            brands={brands}
            rams={rams}
            roms={roms}
            minPrice={0}
            maxPrice={50000000}
            onFilterChange={handleFilterChange}
            onDebounceChange={setIsDebouncing}
            initialFilters={
              brandFilterApplied
                ? currentFilters
                : location.state && location.state.filter
                ? location.state.filter
                : {}
            }
          />
          {/* Loading when debouncing filter */}
          {isDebouncing && (
            <div className="mb-4 text-blue-500 text-sm">Filtering...</div>
          )}
          {/* Result information */}
          {products.length > 0 && (
            <div className="mb-6 text-sm text-gray-600">
              Showing {products.length} products
              {totalElements > 0 && ` (total ${totalElements} products)`}
            </div>
          )}

          {/* Product grid */}
          {products.length === 0 && loading ? (
            <div className="text-center text-gray-500 py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              Loading products...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">{error}</div>
          ) : isFiltering ? (
            <div className="text-center text-gray-500 py-12">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              Filtering products...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">📦</div>
              No products found
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {products.map((product, idx) => (
                  <ProductCard
                    key={product.id || idx}
                    {...product}
                    status={product.status}
                    option={Array.isArray(product.option) ? product.option : []}
                  />
                ))}
              </div>

              {/* Footer to detect scroll */}
              <div ref={footerRef} className="h-8"></div>

              {loading && (
                <div className="text-center text-gray-500 py-4">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading more...
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <div className="text-center text-gray-400 py-4">
                  All products displayed
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
