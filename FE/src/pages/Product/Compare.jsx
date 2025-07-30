import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Check, X } from "lucide-react";
import { compareProducts, getProductById } from "../../api/productService";
import HeaderAuth from "../../components/Header/HeaderAuth";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { isAuthenticated } from "../../services/localCartService";

const ComparePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to merge localStorage data with API data
  const mergeProductData = (apiData, localStorageData) => {
    if (!apiData || !Array.isArray(apiData)) return localStorageData;
    if (!localStorageData || !Array.isArray(localStorageData)) return apiData;
    
    return apiData.map(apiProduct => {
      const localStorageProduct = localStorageData.find(localProduct => localProduct.id === apiProduct.id);
      if (localStorageProduct) {
        // Merge API data with localStorage data, prioritizing API data
        return { ...localStorageProduct, ...apiProduct };
      }
      return apiProduct;
    });
  };

  // Helper function to extract product data from API response
  const extractProductData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return apiData;
    
    return apiData.map(product => {
      // If product has options array, use the first option's data for comparison
      if (product.option && Array.isArray(product.option) && product.option.length > 0) {
        const firstOption = product.option[0];
        return {
          ...product,
          // Use option data for comparison fields
          ram: firstOption.ram || product.ram,
          rom: firstOption.rom || product.rom,
          colorName: firstOption.colorName || product.colorName,
          price: firstOption.price || product.price,
          remainingQuantity: firstOption.remainingQuantity,
          soldQuantity: firstOption.soldQuantity,
          // Keep product-level data
          name: product.name,
          brand: product.brand,
          category: product.category,
          screenDimension: product.screenDimension,
          screenTech: product.screenTech,
          screenResolution: product.screenResolution,
          productImageResponse: product.productImageResponse,
          productStatus: product.productStatus
        };
      }
      return product;
    });
  };

  // Helper function to fetch detailed product data for each product
  const fetchDetailedProductData = async (productIds) => {
    try {
      const detailedProducts = await Promise.all(
        productIds.map(async (id) => {
          try {
            const productData = await getProductById(id);
            return productData;
          } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            return null;
          }
        })
      );
      
      // Filter out null values and return valid products
      return detailedProducts.filter(product => product !== null);
    } catch (error) {
      console.error("Error fetching detailed product data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchCompareData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let productIds = [];
        let localStorageProducts = [];
        
        // Always get data from localStorage first
        const savedProducts = localStorage.getItem("compareProducts");
        if (savedProducts) {
          localStorageProducts = JSON.parse(savedProducts);
          productIds = localStorageProducts.map(p => p.id);
        }
        
        // If we have products from location state (from API), use them
        if (location.state?.products && location.state.products.length > 0) {
          const extractedData = extractProductData(location.state.products);
          const mergedData = mergeProductData(extractedData, localStorageProducts);
          setProducts(mergedData);
          setLoading(false);
          return;
        }
        
        // If we have enough products in localStorage, call API
        if (productIds.length >= 2) {
          try {
            // Call API to get detailed product data
            const response = await compareProducts(productIds);
            
            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
              const extractedData = extractProductData(response.data);
              const mergedData = mergeProductData(extractedData, localStorageProducts);
              setProducts(mergedData);
            } else if (response && Array.isArray(response) && response.length > 0) {
              // Handle case where API returns array directly
              const extractedData = extractProductData(response);
              const mergedData = mergeProductData(extractedData, localStorageProducts);
              setProducts(mergedData);
            } else {
              // Try to fetch detailed data for each product individually
              const detailedProducts = await fetchDetailedProductData(productIds);
              if (detailedProducts.length > 0) {
                const extractedData = extractProductData(detailedProducts);
                const mergedData = mergeProductData(extractedData, localStorageProducts);
                setProducts(mergedData);
              } else {
                setProducts(localStorageProducts);
              }
            }
          } catch (apiError) {
            console.error("API Error:", apiError);
            
            // Try to fetch detailed data for each product individually as fallback
            const detailedProducts = await fetchDetailedProductData(productIds);
            if (detailedProducts.length > 0) {
              const extractedData = extractProductData(detailedProducts);
              const mergedData = mergeProductData(extractedData, localStorageProducts);
              setProducts(mergedData);
            } else {
              setProducts(localStorageProducts);
            }
          }
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error in fetchCompareData:", err);
        setError("Unable to load comparison data. Please try again.");
        
        // Final fallback to localStorage
        const savedProducts = localStorage.getItem("compareProducts");
        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompareData();
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {isAuthenticated() ? <HeaderAuth /> : <Header />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h1 className="text-xl font-bold mb-2">Loading comparison data...</h1>
            <p className="text-neutral-400">Please wait a moment</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {isAuthenticated() ? <HeaderAuth /> : <Header />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-400">Data loading error</h1>
            <p className="text-neutral-400 mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (products.length < 2) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {isAuthenticated() ? <HeaderAuth /> : <Header />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Not enough products to compare</h1>
            <p className="text-neutral-400 mb-6">At least 2 products are required for comparison</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Define comparison categories and their properties
  const comparisonCategories = [
    {
      title: "Basic Information",
      properties: [
        { key: "name", label: "Product Name", type: "text" },
        { key: "brand", label: "Brand", type: "text" },
        { key: "price", label: "Price", type: "price" },
        { key: "description", label: "Description", type: "text" },
        { key: "release_year", label: "Release Year", type: "text" },
        { key: "product_status", label: "Status", type: "status" },
      ]
    },
    {
      title: "Configuration",
      properties: [
        { key: "ram", label: "RAM", type: "ram" },
        { key: "rom", label: "ROM", type: "rom" },
        { key: "cpu", label: "CPU", type: "text" },
        { key: "cpu_speed", label: "CPU Speed (GHz)", type: "number" },
        { key: "gpu", label: "GPU", type: "text" },
        { key: "os", label: "Operating System", type: "text" },
      ]
    },
    {
      title: "Display",
      properties: [
        { key: "screen_dimension", label: "Screen Size", type: "text" },
        { key: "screen_resolution", label: "Resolution", type: "text" },
        { key: "screen_tech", label: "Screen Technology", type: "text" },
        { key: "screen_touch", label: "Touch", type: "text" },
        { key: "max_brightness", label: "Max Brightness", type: "text" },
      ]
    },
    {
      title: "Camera",
      properties: [
        { key: "back_camera", label: "Rear Camera", type: "text" },
        { key: "back_camera_tech", label: "Rear Camera Technology", type: "text" },
        { key: "back_camera_record", label: "Video Recording", type: "text" },
        { key: "front_camera", label: "Front Camera", type: "text" },
        { key: "flash", label: "Flash", type: "boolean" },
      ]
    },
    {
      title: "Battery & Charging",
      properties: [
        { key: "battery_capacity", label: "Battery Capacity (mAh)", type: "battery" },
        { key: "battery_type", label: "Battery Type", type: "text" },
        { key: "battery_tech", label: "Battery Technology", type: "text" },
        { key: "charge_port", label: "Charging Port", type: "text" },
        { key: "charge_support", label: "Charging Support", type: "text" },
      ]
    },
    {
      title: "Connectivity",
      properties: [
        { key: "mobile_network", label: "Mobile Network", type: "text" },
        { key: "wifi", label: "WiFi", type: "text" },
        { key: "bluetooth", label: "Bluetooth", type: "text" },
        { key: "gps", label: "GPS", type: "text" },
        { key: "sim", label: "SIM", type: "text" },
      ]
    },
    {
      title: "Design & Dimensions",
      properties: [
        { key: "dimension", label: "Dimensions", type: "text" },
        { key: "material", label: "Material", type: "text" },
        { key: "design", label: "Design", type: "text" },
        { key: "color_name", label: "Color", type: "color" },
        { key: "resistance_util", label: "Water/Dust Resistance", type: "text" },
      ]
    },
    {
      title: "Features & Applications",
      properties: [
        { key: "advanced_util", label: "Advanced Features", type: "text" },
        { key: "special_util", label: "Special Features", type: "text" },
        { key: "movie_util", label: "Video Applications", type: "text" },
        { key: "music_util", label: "Music Applications", type: "text" },
        { key: "record_util", label: "Recording Applications", type: "text" },
      ]
    },
    {
      title: "Ports & Connections",
      properties: [
        { key: "earphone_port", label: "Earphone Port", type: "text" },
        { key: "another_port", label: "Other Ports", type: "text" },
      ]
    },
    
  ];

  // Helper function to render property value
  const renderPropertyValue = (product, property) => {
    const value = product[property.key];
    
    if (value === null || value === undefined || value === "") {
      return <span className="text-gray-400">-</span>;
    }

    switch (property.type) {
      case "price":
        return (
          <span className="text-blue-600 font-semibold">
            {value.toLocaleString("vi-VN")}₫
          </span>
        );
      case "ram":
        return <span className="text-green-600">{value}GB</span>;
      case "rom":
        return <span className="text-green-600">{value}GB</span>;
      case "battery":
        return <span className="text-yellow-600">{value.toLocaleString()}mAh</span>;
      case "boolean":
        return value ? (
          <Check className="text-green-600 w-4 h-4" />
        ) : (
          <X className="text-red-600 w-4 h-4" />
        );
      case "status":
        return (
          <span className={`px-2 py-1 rounded text-xs ${
            value === "ONSELL" ? "bg-green-100 text-green-800" : 
            value === "PREORDER" ? "bg-yellow-100 text-yellow-800" : 
            "bg-red-100 text-red-800"
          }`}>
            {value === "ONSELL" ? "On Sale" : 
             value === "PREORDER" ? "Pre-order" : 
             "Discontinued"}
          </span>
        );
      case "color":
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: value.toLowerCase() }}
            ></div>
            <span className="text-gray-700">{value}</span>
          </div>
        );
      case "warranty":
        return <span className="text-orange-600">{value} months</span>;
      case "date":
        return <span className="text-gray-600">{new Date(value).toLocaleDateString("en-US")}</span>;
      case "number":
        return <span className="text-purple-600">{value}</span>;
      default:
        // Handle special cases for text values
        if (property.key === "gps" && typeof value === "string") {
          return value.toLowerCase() === "yes" || value.toLowerCase() === "gps" ? (
            <Check className="text-green-600 w-4 h-4" />
          ) : (
            <X className="text-red-600 w-4 h-4" />
          );
        }
        if (property.key === "screen_touch" && typeof value === "string") {
          return value.toLowerCase() === "yes" || value.toLowerCase() === "multi-touch" ? (
            <Check className="text-green-600 w-4 h-4" />
          ) : (
            <X className="text-red-600 w-4 h-4" />
          );
        }
        if (property.key === "flash" && typeof value === "boolean") {
          return value ? (
            <Check className="text-green-600 w-4 h-4" />
          ) : (
            <X className="text-red-600 w-4 h-4" />
          );
        }
        return <span className="text-gray-900">{value}</span>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      {isAuthenticated() ? <HeaderAuth /> : <Header />}
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Product Comparison</h1>
              </div>
              <div className="text-sm text-gray-500">
                {products.length} products
              </div>
            </div>
          </div>
        </div>

        {/* Compare Table */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-4 font-medium text-gray-700 min-w-[200px]">
                      Specification
                    </th>
                    {products.map((product, index) => (
                      <th key={index} className="text-center py-4 px-4 font-medium text-gray-700 min-w-[250px]">
                        <div className="space-y-3">
                          {/* Product image */}
                          <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg overflow-hidden">
                            {product.productImageResponse && Array.isArray(product.productImageResponse) && product.productImageResponse.length > 0 ? (
                              <img
                                src={product.productImageResponse[0].downloadURL || product.productImageResponse[0].url || product.productImageResponse[0].imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = "https://placehold.co/150x180";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                No Image
                              </div>
                            )}
                          </div>
                          
                          {/* Product name */}
                          <h3 className="font-semibold text-sm leading-tight text-gray-900">
                            {product.name}
                          </h3>
                          
                          {/* Product price */}
                          <p className="text-blue-600 font-bold">
                            {product.price?.toLocaleString("vi-VN")}₫
                          </p>
                          
                          {/* Product specs summary */}
                          <div className="text-xs text-gray-500">
                            {product.ram}GB RAM • {product.rom}GB ROM
                          </div>
                          
                          {/* Product status */}
                          <div className="text-xs">
                            <span className={`px-2 py-1 rounded text-xs ${
                              product.product_status === "ONSELL" ? "bg-green-100 text-green-800" : 
                              product.product_status === "PREORDER" ? "bg-yellow-100 text-yellow-800" : 
                              "bg-red-100 text-red-800"
                            }`}>
                              {product.product_status === "ONSELL" ? "On Sale" : 
                               product.product_status === "PREORDER" ? "Pre-order" : 
                               "Discontinued"}
                            </span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                
                <tbody>
                  {comparisonCategories.map((category, categoryIndex) => (
                    <React.Fragment key={categoryIndex}>
                      {/* Category header */}
                      <tr className="bg-blue-50">
                        <td colSpan={products.length + 1} className="py-3 px-4">
                          <h2 className="font-semibold text-lg text-blue-700">
                            {category.title}
                          </h2>
                        </td>
                      </tr>
                      
                      {/* Category properties */}
                      {category.properties.map((property, propertyIndex) => (
                        <tr 
                          key={propertyIndex} 
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-gray-700">
                            {property.label}
                          </td>
                          {products.map((product, productIndex) => (
                            <td key={productIndex} className="py-3 px-4 text-center">
                              {renderPropertyValue(product, property)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ComparePage;