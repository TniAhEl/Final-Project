import React from "react";
import { Scale } from "lucide-react";

const CompareButton = ({ product, className = "", onClick }) => {
  const handleAddToCompare = (e) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }
    
    // Note: Product.jsx handles the compare logic, this button just triggers the onClick
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