import React from "react";
import { Scale } from "lucide-react";

const CompareButton = ({ product, className = "", onClick }) => {
  const handleAddToCompare = (e) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }
    
    if (window.addToCompare) {
      window.addToCompare(product);
    } else {
      // Fallback: add to localStorage directly
      const savedProducts = localStorage.getItem("compareProducts");
      const compareProducts = savedProducts ? JSON.parse(savedProducts) : [];
      
      const exists = compareProducts.find(p => p.id === product.id);
      if (exists) {
        alert("Product already in compare list");
        return;
      }
      
      if (compareProducts.length >= 8) {
        alert("You can only compare up to 8 products");
        return;
      }
      
      // Store product name and product id
      compareProducts.push({
        id: product.id,
        name: product.name
      });
      localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
      
      // Trigger a custom event to notify CompareSidebar
      window.dispatchEvent(new CustomEvent("compareProductsUpdated", {
        detail: { products: compareProducts }
      }));
    }
  };

  return (
    <button
      onClick={handleAddToCompare}
      className={`flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors ${className}`}
    >
      <Scale size={16} />
      <span>Compare</span>
    </button>
  );
};

export default CompareButton; 