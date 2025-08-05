import React, { useEffect, useState } from "react";
import ProductCard from "../Card/Product";
import { FiChevronDown } from "react-icons/fi";
import { filterProducts } from "../../api/productService";
import { useNavigate } from "react-router-dom";

function NewArrivalsAd(props) {
  const {
    title = "New Arrivals!",
    description = "Check out the latest products in our store. Don't miss out on the hottest trends!",
    buttonText = "Shop Now",
  } = props;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [moreClickCount, setMoreClickCount] = useState(0);
  const navigate = useNavigate();
  const PAGE_SIZE = 5;

  // Fetch newest products
  const fetchProducts = async (pageToFetch = 0, append = false) => {
    setLoading(true);
    try {
      const res = await filterProducts(
        { sortByNewest: true },
        pageToFetch,
        PAGE_SIZE
      );
      const newProducts = res.content || [];
      setProducts((prev) => (append ? [...prev, ...newProducts] : newProducts));
      setHasMore((pageToFetch + 1) * PAGE_SIZE < (res.totalElements || 0));
    } catch (err) {
      // can show the error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts(0, false);
    setPage(0);
  }, []);

  const handleMore = () => {
    const newClickCount = moreClickCount + 1;
    setMoreClickCount(newClickCount);
    
    if (newClickCount >= 2) {
      // Sau lần click thứ 2, chuyển sang trang category
      navigate("/products");
    } else if (hasMore) {
      const nextPage = page + 1;
      fetchProducts(nextPage, true);
      setPage(nextPage);
    } else {
      navigate("/products");
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl shadow p-6 gap-6  w-full mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 flex flex-col items-start gap-3">
          <h2 className="text-2xl font-bold text-blue-900">{title}</h2>
          <p className="text-zinc-700 text-base">{description}</p>
          <button
            onClick={handleMore}
            className="mt-2 px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-medium text-base"
          >
            {buttonText}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mt-2">
        {products.map((product, idx) => (
          <div key={product.id || idx} className="w-full">
            <ProductCard
              {...product}
              className="w-full max-w-[200px] mx-auto"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center mt-4">
        <span
          className={`font-medium flex items-center gap-1 cursor-pointer transition-all duration-300 ${
            loading 
              ? "text-gray-400 cursor-not-allowed" 
              : "text-blue-700 hover:underline hover:text-blue-800"
          }`}
          onClick={!loading ? handleMore : undefined}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
              Loading...
            </>
          ) : (
            <>
              More <FiChevronDown className="ml-1 text-xl" />
            </>
          )}
        </span>
      </div>
    </div>
  );
}

export default NewArrivalsAd;
