import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import CompareButton from "../Button/Compare";

const ProductCard = (product) => {
  if (
    !product ||
    (!product.id && !product.name && !product.option && !product.category)
  ) {
    return (
      <div className="w-[280px] h-[480px] bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-300 overflow-hidden shadow-md flex items-center justify-center">
        <span className="text-gray-400 text-sm">No product data</span>
      </div>
    );
  }

  const {
    id,
    name,
    price,
    option,
    category,
    brand,
    screenDimension,
    screenTech,
    screenResolution,
    image,
    productStatus,
  } = product;

  // Helper function to process product images
  const processProductImages = (productData) => {
    if (!productData) return productData;

    // Create a copy of the product data to avoid modifying the original
    const processedData = { ...productData };
    
    
    // Create full URLs for images
    const baseUrl = "http://localhost:8080";
    
    // Process image field (new API format)
    if (processedData.image && typeof processedData.image === 'object') {
      // Single image object
      
      processedData.image = {
        ...processedData.image,
        url: processedData.image.imageUrl ? `${baseUrl}${processedData.image.imageUrl}` : processedData.image.url || "https://placehold.co/260x224"
      };
    } else if (processedData.image && Array.isArray(processedData.image)) {
      // Array of images
      processedData.image = processedData.image.map(img => ({
        ...img,
        url: img.imageUrl ? `${baseUrl}${img.imageUrl}` : img.url || "https://placehold.co/260x224"
      }));
    }
    
    // Process productImageResponse if exists (old format)
    if (processedData.productImageResponse && Array.isArray(processedData.productImageResponse)) {
      processedData.productImageResponse = processedData.productImageResponse.map(img => ({
        ...img,
        url: img.imageUrl ? `${baseUrl}${img.imageUrl}` : img.url || "https://placehold.co/260x224"
      }));
    }
    
    // Process images array if exists (old format)
    if (processedData.images && Array.isArray(processedData.images)) {
      processedData.images = processedData.images.map(img => ({
        ...img,
        url: img.imageUrl ? `${baseUrl}${img.imageUrl}` : img.url || "https://placehold.co/260x224"
      }));
    }

    // If no image field, use productImageResponse or images array
    if (!processedData.image && processedData.productImageResponse) {
      processedData.image = processedData.productImageResponse;
    } else if (!processedData.image && processedData.images) {
      processedData.image = processedData.images;
    }

    // If still no images, create a placeholder
    if (!processedData.image) {
      processedData.image = {
        id: 1,
        url: "https://placehold.co/260x224",
        fileName: "placeholder.png"
      };
    }

    return processedData;
  };

  // Process images for this product
  const processedProduct = processProductImages(product);
  
  // Get the first available image URL
  const getProductImageUrl = () => {
    if (processedProduct.image) {
      if (Array.isArray(processedProduct.image)) {
        return processedProduct.image[0]?.url || "https://placehold.co/260x224";
      } else {
        return processedProduct.image.url || "https://placehold.co/260x224";
      }
    }
    return "https://placehold.co/260x224";
  };
  
  const productImage = getProductImageUrl();

  const navigate = useNavigate();

  // State for option selection
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedRom, setSelectedRom] = useState(null);
  const [isInCompareList, setIsInCompareList] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Function to show notification
  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 1000);
  };



  // Check if product is in compare list on mount
  useEffect(() => {
    const checkCompareStatus = () => {
      try {
        const savedProducts = localStorage.getItem("compareProducts");
        const compareProducts = savedProducts ? JSON.parse(savedProducts) : [];
        
        // Determine which option_id to check - use selectedOption if available
        let optionIdToCheck = null;
        
        if (selectedOption) {
          optionIdToCheck = selectedOption.id;
        } else if (option && Array.isArray(option) && option.length > 0) {
          optionIdToCheck = option[0].id;
        }
        
        // Check if product exists in compare list
        let exists = false;
        
        if (optionIdToCheck) {
          // Check by option_id
          exists = compareProducts.find((p) => p.option_id === optionIdToCheck);
        } else {
          // Check by product id
          const productId = product.id || id;
          exists = compareProducts.find((p) => p.id === productId);
        }
        
        setIsInCompareList(!!exists);
      } catch (error) {
        console.error("Error checking compare status:", error);
        setIsInCompareList(false);
      }
    };

    checkCompareStatus();

    // Listen for compare list updates
    const handleCompareUpdate = () => {
      checkCompareStatus();
    };

    window.addEventListener("compareProductsUpdated", handleCompareUpdate);
    return () => {
      window.removeEventListener("compareProductsUpdated", handleCompareUpdate);
    };
  }, [id, product.id, selectedOption, option]);



  // Helper function to add/remove product from compare list
  const toggleCompareList = (product) => {
    try {
      // Check localStorage
      const savedProducts = localStorage.getItem("compareProducts");
      const compareProducts = savedProducts ? JSON.parse(savedProducts) : [];

      // Get the appropriate ID - prioritize option_id if available
      let productId, optionId;
      const productName = product.name || name;
      
      // Determine which option_id to use
      
      if (option && Array.isArray(option) && option.length > 0) {
        // Use selectedOption if available, otherwise use the first option
        const optionToUse = selectedOption || option[0];
        
        productId = product.id || id;
        optionId = optionToUse.id;
        
        // Update selectedOption if it's not set
        if (!selectedOption) {
          setSelectedOption(optionToUse);
          setSelectedColor(optionToUse.colorName || null);
          setSelectedRam(optionToUse.ram || null);
          setSelectedRom(optionToUse.rom || null);
        }
      } else {
        // If no options available, use product.id
        productId = product.id || id;
        optionId = null;
      }

      // Check if product already exists in compare list
      const existingIndex = compareProducts.findIndex((p) => {
        if (optionId) {
          // If we have option_id, check by option_id
          return p.option_id === optionId;
        } else {
          // Otherwise check by product id
          return p.id === productId;
        }
      });
      
      if (existingIndex !== -1) {
        // Remove product from compare list
        compareProducts.splice(existingIndex, 1);
        setIsInCompareList(false);
        showNotificationMessage("Sản phẩm đã được xóa khỏi danh sách so sánh!");
      } else {
        // Check max quantity
        if (compareProducts.length >= 8) {
          showNotificationMessage("Bạn chỉ có thể so sánh tối đa 8 sản phẩm!");
          return false;
        }

        // Add product to compare list with option information
        const productToAdd = {
          id: productId,
          name: productName,
        };

        // Add image information
        if (processedProduct.image) {
          if (Array.isArray(processedProduct.image)) {
            productToAdd.images = processedProduct.image;
          } else {
            productToAdd.images = [processedProduct.image];
          }
        } else if (processedProduct.productImageResponse) {
          productToAdd.productImageResponse = processedProduct.productImageResponse;
        }

        // Add option_id if available
        if (optionId) {
          productToAdd.option_id = optionId;
          // Add option details for better display
          const optionDetails = selectedOption || (option && Array.isArray(option) 
            ? option.find(opt => opt.id === optionId)
            : null);
          
          if (optionDetails) {
            productToAdd.ram = optionDetails.ram;
            productToAdd.rom = optionDetails.rom;
            productToAdd.color_name = optionDetails.colorName;
            productToAdd.price = optionDetails.price;
          }
        }
        
        compareProducts.push(productToAdd);
        setIsInCompareList(true);
        showNotificationMessage("Sản phẩm đã được thêm vào danh sách so sánh!");
      }

      // Save to localStorage
      const jsonString = JSON.stringify(compareProducts);
      localStorage.setItem("compareProducts", jsonString);

      // Notify CompareSidebar
      window.dispatchEvent(
        new CustomEvent("compareProductsUpdated", {
          detail: { products: compareProducts },
        })
      );

      return true;
    } catch (error) {
      console.error("Error toggling product in compare:", error);
      showNotificationMessage("Lỗi khi cập nhật danh sách so sánh!");
      return false;
    }
  };

  // Helper function to clear all compare products
  const clearAllCompareProducts = () => {
    try {
      localStorage.removeItem("compareProducts");
      setIsInCompareList(false);
      
      // Notify CompareSidebar
      window.dispatchEvent(
        new CustomEvent("compareProductsUpdated", {
          detail: { products: [] },
        })
      );

      showNotificationMessage("Tất cả sản phẩm đã được xóa khỏi danh sách so sánh!");
    } catch (error) {
      console.error("Error clearing compare list:", error);
      showNotificationMessage("Lỗi khi xóa danh sách so sánh!");
    }
  };

  // Get full list of values
  const colorList = Array.from(
    new Set(
      (option || [])
        .filter((opt) => opt && opt.colorName && opt.colorName.trim() !== "")
        .map((opt) => opt.colorName)
    )
  );
  const ramList = Array.from(
    new Set(
      (option || [])
        .filter((opt) => opt && opt.ram != null && !isNaN(opt.ram))
        .map((opt) => opt.ram)
    )
  );
  const romList = Array.from(
    new Set(
      (option || [])
        .filter((opt) => opt && opt.rom != null && !isNaN(opt.rom))
        .map((opt) => opt.rom)
    )
  );

  // Helper to check validity
  const isColorValid = (color, ram = selectedRam, rom = selectedRom) => {
    if (!option) return true;
    if (ram != null && rom != null) {
      return option.some(
        (opt) =>
          opt && opt.colorName === color && opt.ram === ram && opt.rom === rom
      );
    }
    if (ram != null) {
      return option.some(
        (opt) => opt && opt.colorName === color && opt.ram === ram
      );
    }
    if (rom != null) {
      return option.some(
        (opt) => opt && opt.colorName === color && opt.rom === rom
      );
    }
    return true;
  };
  const isRamValid = (ram, color = selectedColor, rom = selectedRom) => {
    if (!option) return true;
    if (color != null && rom != null) {
      return option.some(
        (opt) =>
          opt && opt.ram === ram && opt.colorName === color && opt.rom === rom
      );
    }
    if (color != null) {
      return option.some(
        (opt) => opt && opt.ram === ram && opt.colorName === color
      );
    }
    if (rom != null) {
      return option.some((opt) => opt && opt.ram === ram && opt.rom === rom);
    }
    return true;
  };
  const isRomValid = (rom, color = selectedColor, ram = selectedRam) => {
    if (!option) return true;
    if (color != null && ram != null) {
      return option.some(
        (opt) =>
          opt && opt.rom === rom && opt.colorName === color && opt.ram === ram
      );
    }
    if (color != null) {
      return option.some(
        (opt) => opt && opt.rom === rom && opt.colorName === color
      );
    }
    if (ram != null) {
      return option.some((opt) => opt && opt.rom === rom && opt.ram === ram);
    }
    return true;
  };

  // Initialize options when component mounts
  useEffect(() => {
    if (option && Array.isArray(option) && option.length > 0) {
      // Always select the first option as default
      const firstOption = option[0];
      if (firstOption) {
        setSelectedOption(firstOption);
        setSelectedColor(firstOption.colorName || null);
        setSelectedRam(firstOption.ram || null);
        setSelectedRom(firstOption.rom || null);
      }
    } else {
      // Reset if no options
      setSelectedOption(null);
      setSelectedColor(null);
      setSelectedRam(null);
      setSelectedRom(null);
    }
  }, [option]);

  // When selecting an option, if current selection is invalid, auto switch to first valid option keeping the just-selected value
  useEffect(() => {
    if (!option || !Array.isArray(option)) return;
    // If current selection is valid, keep it
    const found = option.find(
      (opt) =>
        opt &&
        (selectedColor == null || opt.colorName === selectedColor) &&
        (selectedRam == null || opt.ram === selectedRam) &&
        (selectedRom == null || opt.rom === selectedRom)
    );
    if (found) {
      setSelectedOption(found);
      return;
    }
    // If not valid, prioritize keeping the just-selected value (in order: color, ram, rom)
    // 1. If just selected color
    if (selectedColor != null) {
      const validOpt = option.find(
        (opt) => opt && opt.colorName === selectedColor
      );
      if (validOpt) {
        setSelectedRam(validOpt.ram);
        setSelectedRom(validOpt.rom);
        setSelectedOption(validOpt);
        return;
      }
    }
    // 2. If just selected ram
    if (selectedRam != null) {
      const validOpt = option.find((opt) => opt && opt.ram === selectedRam);
      if (validOpt) {
        setSelectedColor(validOpt.colorName);
        setSelectedRom(validOpt.rom);
        setSelectedOption(validOpt);
        return;
      }
    }
    // 3. If just selected rom
    if (selectedRom != null) {
      const validOpt = option.find((opt) => opt && opt.rom === selectedRom);
      if (validOpt) {
        setSelectedColor(validOpt.colorName);
        setSelectedRam(validOpt.ram);
        setSelectedOption(validOpt);
        return;
      }
    }
    // If nothing is valid, select first option
    if (option.length > 0) {
      setSelectedColor(option[0].colorName);
      setSelectedRam(option[0].ram);
      setSelectedRom(option[0].rom);
      setSelectedOption(option[0]);
    }
  }, [selectedColor, selectedRam, selectedRom, option]);

  // Helper function to get color class
  const getColorClass = (color) => {
    if (!color || typeof color !== "string") return "bg-gray-200";
    const cleanColor = color.toLowerCase().trim();
    switch (cleanColor) {
      case "black":
        return "bg-black";
      case "white":
        return "bg-white border border-gray-300";
      case "red":
        return "bg-red-600";
      case "blue":
        return "bg-blue-600";
      case "green":
        return "bg-green-600";
      case "yellow":
        return "bg-yellow-500";
      case "purple":
        return "bg-purple-600";
      case "pink":
        return "bg-pink-500";
      case "gray":
        return "bg-gray-500";
      case "gold":
        return "bg-yellow-400";
      case "silver":
        return "bg-gray-300";
      default:
        return "bg-gray-200";
    }
  };

  const front = (
    <div className="group w-[260px] h-[540px] bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-300 overflow-hidden shadow-md hover:shadow-lg transition flex flex-col relative">
      {/* Badge status */}
      {productStatus && (
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-md z-10
            ${
              productStatus === "ONSELL"
                ? "bg-green-500 text-white"
                : productStatus === "PREORDER"
                ? "bg-yellow-400 text-gray-800"
                : "bg-gray-300 text-gray-700"
            }
          `}
        >
          {productStatus === "ONSELL"
            ? "On Sell"
            : productStatus === "PREORDER"
            ? "Pre Order"
            : productStatus}
        </div>
      )}
             {/* Image centered */}
       <div className="w-full h-56 flex items-center justify-center bg-gray-50 overflow-hidden">
         <img
           src={productImage}
           alt={name || "Product"}
           className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-300"
           onError={(e) => {
             e.target.src = "https://placehold.co/260x224";
           }}
         />
       </div>
     
      {/* Product information */}
      <div className="flex-1 flex flex-col w-full px-4 gap-2">
        <div className="text-right text-slate-500 text-xs font-medium font-['Inter'] leading-[14.40px]">
          {category?.name || "Unknown category"}
        </div>
        <div className="text-zinc-700 text-base font-medium font-['Inter'] leading-tight truncate transition-colors duration-300 group-hover:text-blue-600 w-full">
          {name || "No name"}
        </div>
        <div className="text-slate-500 text-xs font-medium font-['Inter'] leading-tight w-full">
          {screenDimension || "N/A"}
          {" | "}
          {screenTech || "N/A"}
          {" | "}
          {screenResolution || "N/A"}
        </div>
        {/* Color, RAM, ROM */}
        <div className="flex flex-col gap-y-1 w-full">
          {/* Color */}
          {colorList.length > 0 && (
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-500">Color:</span>
              <div className="flex gap-1 flex-wrap">
                {colorList.map((color) => {
                  const faded = !isColorValid(color);
                  return (
                    <button
                      key={color}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedColor === color && isColorValid(color))
                          return;
                        // If current combination is invalid, find the first option with this color
                        const validOpt = (option || []).find(
                          (opt) => opt && opt.colorName === color
                        );
                        if (validOpt) {
                          setSelectedColor(validOpt.colorName);
                          setSelectedRam(validOpt.ram);
                          setSelectedRom(validOpt.rom);
                        } else {
                          setSelectedColor(color);
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded border ${
                        selectedColor === color
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      } ${faded ? "opacity-30" : ""}`}
                      title={color}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {/* RAM */}
          {ramList.length > 0 && (
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-500">RAM:</span>
              <div className="flex gap-1 flex-wrap">
                {ramList.map((ram) => {
                  const faded = !isRamValid(ram);
                  return (
                    <button
                      key={ram}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedRam === ram && isRamValid(ram)) return;
                        // If current combination is invalid, find the first option with this ram
                        const validOpt = (option || []).find(
                          (opt) => opt && opt.ram === ram
                        );
                        if (validOpt) {
                          setSelectedColor(validOpt.colorName);
                          setSelectedRam(validOpt.ram);
                          setSelectedRom(validOpt.rom);
                        } else {
                          setSelectedRam(ram);
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded border ${
                        selectedRam === ram
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      } ${faded ? "opacity-30" : ""}`}
                    >
                      {ram}GB
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {/* ROM */}
          {romList.length > 0 && (
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-500">ROM:</span>
              <div className="flex gap-1 flex-wrap">
                {romList.map((rom) => {
                  const faded = !isRomValid(rom);
                  return (
                    <button
                      key={rom}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedRom === rom && isRomValid(rom)) return;
                        // If current combination is invalid, find the first option with this rom
                        const validOpt = (option || []).find(
                          (opt) => opt && opt.rom === rom
                        );
                        if (validOpt) {
                          setSelectedColor(validOpt.colorName);
                          setSelectedRam(validOpt.ram);
                          setSelectedRom(validOpt.rom);
                        } else {
                          setSelectedRom(rom);
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded border ${
                        selectedRom === rom
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      } ${faded ? "opacity-30" : ""}`}
                    >
                      {rom}GB
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* Selected Option */}
        {/* Removed selected option display section */}
        {/* Price */}
        <div className="text-zinc-700 text-xl font-semibold font-['Inter'] leading-loose w-full">
          {selectedOption &&
          selectedOption.price != null &&
          !isNaN(selectedOption.price) ? (
            <span>{selectedOption.price.toLocaleString("vi-VN")}₫</span>
          ) : option && Array.isArray(option) && option.length > 0 ? (
            (() => {
              const validOptions = option.filter(
                (opt) =>
                  opt && opt.price != null && !isNaN(opt.price) && opt.price > 0
              );
              if (validOptions.length > 0) {
                const prices = validOptions.map((opt) => opt.price);
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                return (
                  <span>
                    From {minPrice.toLocaleString("vi-VN")}₫ -{" "}
                    {maxPrice.toLocaleString("vi-VN")}₫
                  </span>
                );
              }
              return null;
            })()
          ) : price != null && !isNaN(price) && price > 0 ? (
            <span>{price.toLocaleString("vi-VN")}₫</span>
          ) : null}
        </div>
        {/* Number of versions and Compare button */}
        {option && Array.isArray(option) && option.length > 0 && (
          <div className="flex items-center justify-between w-full">
            <div className="text-xs text-gray-700 font-semibold">
              {option.length} versions
            </div>
            <CompareButton
              product={{ id, name, price, brand, ...product }}
              className={`py-1 px-3 text-xs ${
                isInCompareList 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation to product detail

                // Always use main product Id and name
                const currentProduct = { id, name, price, brand, ...product };
                toggleCompareList(currentProduct);
              }}
            >
              {isInCompareList ? "Remove" : "Compare"}
            </CompareButton>
          </div>
        )}

        {/* Compare button for products without options */}
        {(!option || !Array.isArray(option) || option.length === 0) && (
          <div className="mt-2">
            <CompareButton
              product={{ id, name, price, brand, ...product }}
              className={`w-full py-2 text-xs ${
                isInCompareList 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigation to product detail

                // Always use main product Id and name
                const currentProduct = { id, name, price, brand, ...product };
                toggleCompareList(currentProduct);
              }}
            >
              {isInCompareList ? "Remove from Compare" : "Add to Compare"}
            </CompareButton>
          </div>
        )}
      </div>
    </div>
  );

  try {
    return (
      <div className="relative">
        <div
          className="w-[240px] h-[540px] cursor-pointer [perspective:1200px]"
          onClick={() => navigate(`/product/${id}`)}
        >
          {front}
        </div>
        
        {/* Notification */}
        {showNotification && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2">
              <Check size={16} />
              <span className="text-sm font-medium">{notificationMessage}</span>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error rendering ProductCard:", error, product);
    return (
      <div className="w-[240px] h-[480px] bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-300 overflow-hidden shadow-md p-4 flex flex-col items-center justify-center">
        <div className="text-red-500 text-sm">Cannot display this product</div>
        <div className="text-xs text-gray-500 mt-2">
          ID: {id || "N/A"}, Name: {name || "N/A"}
        </div>
      </div>
    );
  }
};

export default ProductCard;
