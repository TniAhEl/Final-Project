import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2, ArrowRight } from "lucide-react";
import { compareProducts as compareProductsAPI } from "../../api/productService";

const CompareSidebar = () => {
  const navigate = useNavigate();
  const [compareProducts, setCompareProducts] = useState([]);
  const maxProducts = 4;

  // Load compare products from localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem("compareProducts");
    if (savedProducts) {
      setCompareProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Save compare products to localStorage
  useEffect(() => {
    localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
  }, [compareProducts]);

  // Add product to compare
  const addToCompare = (product) => {
    if (compareProducts.length >= maxProducts) {
      alert(`Can compare up to ${maxProducts} products`);
      return;
    }
    
    const exists = compareProducts.find(p => p.id === product.id);
    if (exists) {
      alert("Product is already in the comparison list");
      return;
    }
    
    setCompareProducts([...compareProducts, {
      id: product.id,
      name: product.name
    }]);
  };

  // Remove product from compare
  const removeFromCompare = (productId) => {
    setCompareProducts(compareProducts.filter(p => p.id !== productId));
  };

  // Clear all products
  const clearAll = () => {
    setCompareProducts([]);
  };

  // Navigate to compare page
  const goToCompare = async () => {
    if (compareProducts.length < 2) {
      alert("At least 2 products are required for comparison");
      return;
    }
    
    try {
      // Extract only IDs for API call
      const productIds = compareProducts.map(p => p.id);
      
      // Call API to get detailed data
      const response = await compareProductsAPI(productIds);
      
      // Navigate with detailed data from API
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        navigate("/compare", { state: { products: response.data } });
      } else {
        navigate("/compare", { state: { products: compareProducts } });
      }
    } catch (error) {
      console.error("Error fetching compare data:", error);
      // Fallback to localStorage data if API fails
      navigate("/compare", { state: { products: compareProducts } });
    }
  };

  // Expose addToCompare function globally and listen for custom events
  useEffect(() => {
    window.addToCompare = addToCompare;
    
    // Listen for custom events from CompareButton
    const handleCompareProductsUpdated = (event) => {
      setCompareProducts(event.detail.products);
    };
    
    window.addEventListener("compareProductsUpdated", handleCompareProductsUpdated);
    
    // Listen for storage changes (when localStorage is updated from other tabs/windows)
    const handleStorageChange = (event) => {
      if (event.key === "compareProducts") {
        try {
          const newProducts = event.newValue ? JSON.parse(event.newValue) : [];
          setCompareProducts(newProducts);
        } catch (error) {
          console.error("Error parsing compare products from storage:", error);
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      delete window.addToCompare;
      window.removeEventListener("compareProductsUpdated", handleCompareProductsUpdated);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [compareProducts]);

  if (compareProducts.length === 0) {
    return null; // Hide sidebar when no products
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-700 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Product slots */}
          <div className="flex gap-2 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
              .overflow-x-auto::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {Array.from({ length: maxProducts }).map((_, index) => {
              const product = compareProducts[index];
              return (
                <div
                  key={index}
                  className={`flex-shrink-0 w-32 ${
                    product ? "bg-neutral-800" : "bg-neutral-800/50"
                  } rounded-lg p-2 border border-neutral-700 relative`}
                >
                  {product ? (
                    <>
                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full transition-colors z-10"
                      >
                        <X size={10} className="text-white" />
                      </button>
                      
                      {/* Product placeholder */}
                      <div className="w-full aspect-square bg-neutral-700 rounded mb-2 overflow-hidden flex items-center justify-center">
                        <div className="text-neutral-500 text-xs text-center">
                          ID: {product.id}
                        </div>
                      </div>
                      
                      {/* Product info */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-medium text-neutral-100 truncate">
                          {product.name}
                        </h4>
                        <p className="text-xs text-blue-400 font-semibold">
                          Loading ...
                        </p>
                        <div className="text-xs text-neutral-400">
                          Information will be displayed when comparing
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-neutral-500 text-xs">
                      Empty
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            {/* Product count info */}
            <div className="text-xs text-neutral-400">
              {compareProducts.length}/{maxProducts} products
            </div>
            
            {compareProducts.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 px-3 py-2 text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 size={14} />
                Remove all
              </button>
            )}
            
            <button
              onClick={goToCompare}
              disabled={compareProducts.length < 2}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                compareProducts.length >= 2
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
              }`}
            >
              Compare ({compareProducts.length})
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareSidebar; 