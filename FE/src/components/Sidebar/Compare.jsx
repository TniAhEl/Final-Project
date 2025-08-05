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

  // Note: localStorage is managed by Product.jsx, not here
  // This component only reads from localStorage and updates its state

  // Add product to compare
  const addToCompare = (product) => {
    if (compareProducts.length >= maxProducts) {
      alert(`Can compare up to ${maxProducts} products`);
      return;
    }
    
    // Check if product already exists (by option_id if available, otherwise by id)
    const exists = compareProducts.find(p => {
      if (product.option_id && p.option_id) {
        return p.option_id === product.option_id;
      }
      return p.id === product.id;
    });
    
    if (exists) {
      alert("Product is already in the comparison list");
      return;
    }
    
    const newCompareProducts = [...compareProducts, {
      id: product.id,
      name: product.name,
      option_id: product.option_id || null,
      ram: product.ram || null,
      rom: product.rom || null,
      color_name: product.color_name || null,
      price: product.price || null
    }];
    
    setCompareProducts(newCompareProducts);
    
    // Update localStorage through Product.jsx's mechanism
    localStorage.setItem("compareProducts", JSON.stringify(newCompareProducts));
    window.dispatchEvent(
      new CustomEvent("compareProductsUpdated", {
        detail: { products: newCompareProducts },
      })
    );
  };

  // Remove product from compare
  const removeFromCompare = (identifier) => {
    // Check if identifier is an option_id or product_id
    const productToRemove = compareProducts.find(p => 
      p.option_id === identifier || p.id === identifier
    );
    
    if (productToRemove) {
      let newCompareProducts;
      // Remove by option_id if available, otherwise by id
      if (productToRemove.option_id) {
        newCompareProducts = compareProducts.filter(p => p.option_id !== productToRemove.option_id);
      } else {
        newCompareProducts = compareProducts.filter(p => p.id !== productToRemove.id);
      }
      
      setCompareProducts(newCompareProducts);
      
      // Update localStorage through Product.jsx's mechanism
      localStorage.setItem("compareProducts", JSON.stringify(newCompareProducts));
      window.dispatchEvent(
        new CustomEvent("compareProductsUpdated", {
          detail: { products: newCompareProducts },
        })
      );
    }
  };

  // Clear all products
  const clearAll = () => {
    setCompareProducts([]);
    
    // Update localStorage through Product.jsx's mechanism
    localStorage.removeItem("compareProducts");
    window.dispatchEvent(
      new CustomEvent("compareProductsUpdated", {
        detail: { products: [] },
      })
    );
  };

  // Navigate to compare page
  const goToCompare = async () => {
    if (compareProducts.length < 2) {
      alert("At least 2 products are required for comparison");
      return;
    }
    
    try {
      // Extract productOptionIds for API call - prioritize option_id over id
      const productOptionId = compareProducts.map(p => {
        if (p.option_id) {
          return p.option_id;
        }
        return p.id;
      });
      
      // Call API to get detailed data
      const response = await compareProductsAPI(productOptionId);
      
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
  }, []); // Remove compareProducts dependency to prevent infinite loops

  if (compareProducts.length === 0) {
    return null; // Hide sidebar when no products
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-indigo-900 border-t border-blue-700 z-50">
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
                    product ? "bg-blue-800/80" : "bg-blue-800/40"
                  } rounded-lg p-2 border border-blue-600 relative`}
                >
                  {product ? (
                    <>
                                             {/* Remove button */}
                       <button
                         onClick={() => removeFromCompare(product.option_id || product.id)}
                         className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 rounded-full transition-colors z-10"
                       >
                         <X size={10} className="text-white" />
                       </button>
                      
                                             {/* Product image */}
                       <div className="w-full aspect-square bg-blue-700/60 rounded mb-2 overflow-hidden flex items-center justify-center">
                         {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                           <img
                             src={product.images[0].url || product.images[0].imageUrl || `http://localhost:8080${product.images[0].image_url}`}
                             alt={product.name}
                             className="w-full h-full object-contain"
                             onError={(e) => {
                               e.target.src = "https://placehold.co/120x120";
                             }}
                           />
                         ) : product.productImageResponse && Array.isArray(product.productImageResponse) && product.productImageResponse.length > 0 ? (
                           <img
                             src={product.productImageResponse[0].url || product.productImageResponse[0].imageUrl || product.productImageResponse[0].downloadURL}
                             alt={product.name}
                             className="w-full h-full object-contain"
                             onError={(e) => {
                               e.target.src = "https://placehold.co/120x120";
                             }}
                           />
                         ) : (
                           <div className="text-neutral-500 text-xs text-center">
                             {product.option_id ? `Option: ${product.option_id}` : `ID: ${product.id}`}
                           </div>
                         )}
                       </div>
                      
                      {/* Product info */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-medium text-white truncate">
                          {product.name}
                          {product.color_name && ` (${product.color_name})`}
                        </h4>
                        <p className="text-xs text-yellow-300 font-semibold">
                          {product.price ? `${product.price.toLocaleString("vi-VN")}₫` : "Loading ..."}
                        </p>
                        <div className="text-xs text-blue-200">
                          {product.ram && product.rom ? `${product.ram}GB RAM • ${product.rom}GB ROM` : "Information will be displayed when comparing"}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-blue-300 text-xs">
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
            <div className="text-xs text-blue-200">
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
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-blue-700/50 text-blue-300 cursor-not-allowed"
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