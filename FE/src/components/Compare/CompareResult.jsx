import React from "react";

const CompareResult = ({ compareData }) => {
  if (!compareData || !compareData.data || compareData.data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg">No products to compare</div>
      </div>
    );
  }

  const products = compareData.data;
  const total = compareData.total;

  // Define the fields to compare
  const comparisonFields = [
    { key: "name", label: "Product Name", type: "text" },
    { key: "brand", label: "Brand", type: "text" },
    { key: "category_name", label: "Category", type: "text" },
    { key: "screen_dimension", label: "Screen Size", type: "text" },
    { key: "screen_resolution", label: "Resolution", type: "text" },
    { key: "screen_tech", label: "Screen Technology", type: "text" },
    { key: "cpu", label: "CPU", type: "text" },
    { key: "cpu_speed", label: "CPU Speed (GHz)", type: "number" },
    { key: "gpu", label: "GPU", type: "text" },
    { key: "battery_capacity", label: "Battery (mAh)", type: "number" },
    { key: "battery_type", label: "Battery Type", type: "text" },
    { key: "charge_support", label: "Charging", type: "text" },
    { key: "back_camera", label: "Back Camera", type: "text" },
    { key: "front_camera", label: "Front Camera", type: "text" },
    { key: "os", label: "Operating System", type: "text" },
    { key: "mobile_network", label: "Network", type: "text" },
    { key: "wifi", label: "WiFi", type: "text" },
    { key: "bluetooth", label: "Bluetooth", type: "text" },
    { key: "gps", label: "GPS", type: "text" },
    { key: "dimension", label: "Dimensions", type: "text" },
    { key: "material", label: "Material", type: "text" },
    { key: "design", label: "Design", type: "text" },
    { key: "sim", label: "SIM", type: "text" },
    { key: "earphone_port", label: "Headphone Jack", type: "text" },
    { key: "charge_port", label: "Charging Port", type: "text" },
    { key: "flash", label: "Flash", type: "boolean" },
    { key: "release_year", label: "Release Year", type: "number" },
    { key: "description", label: "Description", type: "text" },
  ];

  const formatValue = (value, type) => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }

    switch (type) {
      case "number":
        return typeof value === "number" ? value.toLocaleString() : value;
      case "boolean":
        return value ? "Yes" : "No";
      case "text":
      default:
        return value;
    }
  };

  const getOptionValue = (product, fieldKey) => {
    if (fieldKey === "ram" || fieldKey === "rom") {
      // Get unique values from options
      const values = [...new Set(product.options?.map(opt => opt[fieldKey]) || [])];
      return values.length > 0 ? values.join(", ") + (fieldKey === "ram" ? "GB" : "GB") : "N/A";
    }
    return product[fieldKey];
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max">
        {/* Header */}
        <div className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <div className="grid grid-cols-1 gap-4 p-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            <div className="font-semibold text-gray-700">Features</div>
            {products.map((product, index) => (
              <div key={product.id} className="text-center">
                <div className="font-semibold text-gray-700 mb-2">{product.name}</div>
                <div className="text-sm text-gray-500">{product.brand}</div>
                {product.options && product.options.length > 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    {product.options.length} variants
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="divide-y divide-gray-200">
          {comparisonFields.map((field) => (
            <div key={field.key} className="hover:bg-gray-50">
              <div className="grid grid-cols-1 gap-4 p-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
                <div className="font-medium text-gray-700 text-sm">
                  {field.label}
                </div>
                {products.map((product) => (
                  <div key={product.id} className="text-center text-sm">
                    {formatValue(getOptionValue(product, field.key), field.type)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RAM & ROM Comparison */}
        <div className="bg-green-50 border-t-4 border-green-500">
          <div className="grid grid-cols-1 gap-4 p-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            <div className="font-semibold text-green-700">RAM & Storage</div>
            {products.map((product) => {
              const ramValues = [...new Set(product.options?.map(opt => opt.ram) || [])];
              const romValues = [...new Set(product.options?.map(opt => opt.rom) || [])];
              
              return (
                <div key={product.id} className="text-center">
                  {ramValues.length > 0 || romValues.length > 0 ? (
                    <div>
                      {ramValues.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">RAM:</span> {ramValues.join(", ")}GB
                        </div>
                      )}
                      {romValues.length > 0 && (
                        <div className="text-sm">
                          <span className="font-medium">Storage:</span> {romValues.join(", ")}GB
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500">N/A</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Comparison */}
        <div className="bg-blue-50 border-t-4 border-blue-500">
          <div className="grid grid-cols-1 gap-4 p-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            <div className="font-semibold text-blue-700">Price Range</div>
            {products.map((product) => {
              const prices = product.options?.map(opt => opt.price).filter(p => p > 0) || [];
              
              return (
                <div key={product.id} className="text-center">
                  {prices.length > 0 ? (
                    <div>
                      <div className="font-semibold text-green-600">
                        {Math.min(...prices).toLocaleString("vi-VN")}₫
                      </div>
                      {prices.length > 1 && (
                        <div className="text-xs text-gray-500">
                          - {Math.max(...prices).toLocaleString("vi-VN")}₫
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500">N/A</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Options Comparison */}
        {products.some(p => p.options && p.options.length > 0) && (
          <div className="bg-gray-50 border-t border-gray-200">
            <div className="p-4">
              <h3 className="font-semibold text-gray-700 mb-4">Available Options</h3>
              <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
                <div className="font-medium text-gray-700 text-sm">Color & Storage</div>
                {products.map((product) => (
                  <div key={product.id} className="text-sm">
                    {product.options && product.options.length > 0 ? (
                      <div className="space-y-2">
                        {product.options.map((option, optIndex) => (
                          <div key={optIndex} className="p-2 bg-white rounded border text-xs">
                            <div className="font-medium">{option.color_name}</div>
                            <div className="text-gray-600">
                              {option.ram}GB RAM, {option.rom}GB Storage
                            </div>
                            <div className="text-green-600 font-semibold">
                              {option.price.toLocaleString("vi-VN")}₫
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500">No options</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompareResult; 