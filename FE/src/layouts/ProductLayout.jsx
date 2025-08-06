import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdPhoneIphone, MdBatteryFull } from "react-icons/md";
import {
  FaMicrochip,
  FaCamera,
  FaCameraRetro,
  FaTruck,
  FaCheckCircle,
  FaShieldAlt,
  FaTimesCircle,
} from "react-icons/fa";
import { Scale } from "lucide-react";
import { getProductById } from "../api/productService";

// Function to decode JWT to get userId from token
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    // userId can be id, sub, userId depending on backend
    return decoded.userId || decoded.id || decoded.sub || null;
  } catch {
    return null;
  }
}

const ProductLayout = ({ 
  productData, 
  onOptionChange, 
  onAddToCart, 
  addToCartLoading, 
  addToCartMessage, 
  cartItemCount 
}) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedRom, setSelectedRom] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // Add state for selected image
  const [isInCompareList, setIsInCompareList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (productData) {
      // Use productData from props
      setProduct(productData);
      setSelectedImageIndex(0); // Reset selected image when product changes
      if (
        productData &&
        Array.isArray(productData.option) &&
        productData.option.length > 0
      ) {
        setSelectedOption(productData.option[0]);
        setSelectedColor(productData.option[0].colorName);
        setSelectedRam(productData.option[0].ram);
        setSelectedRom(productData.option[0].rom);
      } else {
        setSelectedOption(null);
        setSelectedColor(null);
        setSelectedRam(null);
        setSelectedRom(null);
      }
      // Set default store if available
      if (
        productData &&
        Array.isArray(productData.stores) &&
        productData.stores.length > 0
      ) {
        setSelectedStore(productData.stores[0]);
      } else {
        setSelectedStore(null);
      }
      return;
    }

    // Only call API if no productData from props
    setLoading(true);
    getProductById(id)
      .then((data) => {
        let prod = null;
        if (data && data.name) {
          prod = data;
        } else if (
          data &&
          typeof data === "object" &&
          data.data &&
          data.data.name
        ) {
          prod = data.data;
        }
        setProduct(prod);
        setSelectedImageIndex(0); // Reset selected image when product changes
        setLoading(false);
        if (prod && Array.isArray(prod.option) && prod.option.length > 0) {
          setSelectedOption(prod.option[0]);
          setSelectedColor(prod.option[0].colorName);
          setSelectedRam(prod.option[0].ram);
          setSelectedRom(prod.option[0].rom);
        } else {
          setSelectedOption(null);
          setSelectedColor(null);
          setSelectedRam(null);
          setSelectedRom(null);
        }
        // Set default store if available
        if (prod && Array.isArray(prod.stores) && prod.stores.length > 0) {
          setSelectedStore(prod.stores[0]);
        } else {
          setSelectedStore(null);
        }
      })
      .catch(() => {
        setError("Failed to load product details.");
        setLoading(false);
      });
  }, [id, productData]);

  // When color is selected, update ram/rom list and selectedOption
  useEffect(() => {
    if (!product || !Array.isArray(product.option)) return;
    const optionsByColor = product.option.filter(
      (opt) => opt.colorName === selectedColor && opt.remainingQuantity > 0
    );
    // Get unique ram/rom list for this color
    const ramList = Array.from(new Set(optionsByColor.map((opt) => opt.ram)));
    const romList = Array.from(new Set(optionsByColor.map((opt) => opt.rom)));
    // If selectedRam is no longer valid, select first ram
    let ram = selectedRam;
    if (!ramList.includes(selectedRam)) ram = ramList[0];
    // If selectedRom is no longer valid, select first rom
    let rom = selectedRom;
    if (!romList.includes(selectedRom)) rom = romList[0];
    setSelectedRam(ram);
    setSelectedRom(rom);
    // Update selectedOption
    const found = optionsByColor.find(
      (opt) => opt.ram === ram && opt.rom === rom
    );
    if (found) setSelectedOption(found);
  }, [selectedColor, product]);

  // When ram or rom is selected, update selectedOption
  useEffect(() => {
    if (!product || !Array.isArray(product.option)) return;
    // Filter valid option with color, ram, rom
    const found = product.option.find(
      (opt) =>
        (selectedColor ? opt.colorName === selectedColor : true) &&
        (selectedRam ? opt.ram === selectedRam : true) &&
        (selectedRom ? opt.rom === selectedRom : true) &&
        opt.remainingQuantity > 0
    );
    if (found) setSelectedOption(found);
  }, [selectedRam, selectedRom, selectedColor, product]);

  // Auto update selectedOption when selection changes for Details page
  useEffect(() => {
    if (!product?.option || !Array.isArray(product.option)) return;
    const found = product.option.find(
      (opt) =>
        opt &&
        (selectedColor == null || opt.colorName === selectedColor) &&
        (selectedRam == null || opt.ram === selectedRam) &&
        (selectedRom == null || opt.rom === selectedRom) &&
        opt.remainingQuantity > 0
    );
    if (found) {
      setSelectedOption(found);
      if (onOptionChange) onOptionChange(found);
      return;
    }
    // If no valid option found, prioritize keeping the selected value
    if (selectedColor != null) {
      const validOpt = product.option.find(
        (opt) =>
          opt && opt.colorName === selectedColor && opt.remainingQuantity > 0
      );
      if (validOpt) {
        setSelectedRam(validOpt.ram);
        setSelectedRom(validOpt.rom);
        setSelectedOption(validOpt);
        if (onOptionChange) onOptionChange(validOpt);
        return;
      }
    }
    if (selectedRam != null) {
      const validOpt = product.option.find(
        (opt) => opt && opt.ram === selectedRam && opt.remainingQuantity > 0
      );
      if (validOpt) {
        setSelectedColor(validOpt.colorName);
        setSelectedRom(validOpt.rom);
        setSelectedOption(validOpt);
        if (onOptionChange) onOptionChange(validOpt);
        return;
      }
    }
    if (selectedRom != null) {
      const validOpt = product.option.find(
        (opt) => opt && opt.rom === selectedRom && opt.remainingQuantity > 0
      );
      if (validOpt) {
        setSelectedColor(validOpt.colorName);
        setSelectedRam(validOpt.ram);
        setSelectedOption(validOpt);
        if (onOptionChange) onOptionChange(validOpt);
        return;
      }
    }
    // If no valid option found, select first available option
    const firstAvailableOption = product.option.find(
      (opt) => opt && opt.remainingQuantity > 0
    );
    if (firstAvailableOption) {
      setSelectedColor(firstAvailableOption.colorName);
      setSelectedRam(firstAvailableOption.ram);
      setSelectedRom(firstAvailableOption.rom);
      setSelectedOption(firstAvailableOption);
      if (onOptionChange) onOptionChange(firstAvailableOption);
    }
  }, [
    selectedColor,
    selectedRam,
    selectedRom,
    product?.option,
    onOptionChange,
  ]);

  // Check compare status when selectedOption changes
  useEffect(() => {
    checkCompareStatus();
  }, [selectedOption]);

  // Helper functions to check option states
  const getOptionState = (option) => {
    if (!option) return "unavailable";

    // Check if this is the currently selected option
    const isSelected = selectedOption && selectedOption.id === option.id;
    if (isSelected) return "selected";

    // Check if this option is available (has remaining quantity)
    if (option.remainingQuantity > 0) return "available";

    return "unavailable";
  };

  const getColorState = (color) => {
    if (!color) return "unavailable";

    // Check if this color is currently selected
    if (selectedColor === color) return "selected";

    // Check if this color has any available options
    const hasAvailableOptions = (product.option || []).some(
      (opt) => opt.colorName === color && opt.remainingQuantity > 0
    );

    return hasAvailableOptions ? "available" : "unavailable";
  };

  const getRamState = (ram) => {
    if (ram == null) return "unavailable";

    // Check if this RAM is currently selected
    if (selectedRam === ram) return "selected";

    // Check if this RAM has any available options with current color
    const hasAvailableOptions = (product.option || []).some(
      (opt) =>
        opt.ram === ram &&
        opt.colorName === selectedColor &&
        opt.remainingQuantity > 0
    );

    return hasAvailableOptions ? "available" : "unavailable";
  };

  const getRomState = (rom) => {
    if (rom == null) return "unavailable";

    // Check if this ROM is currently selected
    if (selectedRom === rom) return "selected";

    // Check if this ROM has any available options with current color and RAM
    const hasAvailableOptions = (product.option || []).some(
      (opt) =>
        opt.rom === rom &&
        opt.colorName === selectedColor &&
        opt.ram === selectedRam &&
        opt.remainingQuantity > 0
    );

    return hasAvailableOptions ? "available" : "unavailable";
  };

  // Handle option selection
  const handleColorSelect = (color) => {
    if (getColorState(color) === "unavailable") return;

    // Find first available option with this color
    const availableOption = (product.option || []).find(
      (opt) => opt.colorName === color && opt.remainingQuantity > 0
    );

    if (availableOption) {
      setSelectedColor(color);
      setSelectedRam(availableOption.ram);
      setSelectedRom(availableOption.rom);
      setSelectedOption(availableOption);
    }
  };

  const handleRamSelect = (ram) => {
    if (getRamState(ram) === "unavailable") return;

    // Find first available option with this RAM and current color
    const availableOption = (product.option || []).find(
      (opt) =>
        opt.ram === ram &&
        opt.colorName === selectedColor &&
        opt.remainingQuantity > 0
    );

    if (availableOption) {
      setSelectedRam(ram);
      setSelectedRom(availableOption.rom);
      setSelectedOption(availableOption);
    }
  };

  const handleRomSelect = (rom) => {
    if (getRomState(rom) === "unavailable") return;

    // Find first available option with this ROM, current color and RAM
    const availableOption = (product.option || []).find(
      (opt) =>
        opt.rom === rom &&
        opt.colorName === selectedColor &&
        opt.ram === selectedRam &&
        opt.remainingQuantity > 0
    );

    if (availableOption) {
      setSelectedRom(rom);
      setSelectedOption(availableOption);
    }
  };

  // Function to handle add to cart
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(1);
    }
  };

  // Buy Now handler
  const handleBuyNow = async () => {
    if (!selectedOption || !selectedOption.id || selectedOption.remainingQuantity <= 0) return;
    
    if (onAddToCart) {
      await onAddToCart(1);
      // Navigate to checkout after adding to cart
      setTimeout(() => {
        navigate("/order/checkout");
      }, 1000);
    }
  };

  // Pre Order handler
  const handlePreOrder = () => {
    // Show notification using the global notification system
    localStorage.setItem("showNotification", "true");
    localStorage.setItem("notificationMessage", "Feature under development");
    window.dispatchEvent(new CustomEvent("showNotification", { 
      detail: { 
        message: "Feature under development", 
        type: "warning" 
      } 
    }));
  };

  // Function to show notification
  const showNotificationMessage = (message) => {
    localStorage.setItem("showNotification", "true");
    localStorage.setItem("notificationMessage", message);
    window.dispatchEvent(new CustomEvent("showNotification", { detail: { message } }));
  };

  // Check if product is in compare list
  const checkCompareStatus = () => {
    try {
      const savedProducts = localStorage.getItem("compareProducts");
      const compareProducts = savedProducts ? JSON.parse(savedProducts) : [];
      
      const optionId = selectedOption?.id;
      const productId = product?.id;
      
      const exists = compareProducts.findIndex((p) => {
        if (optionId) {
          return p.option_id === optionId;
        } else {
          return p.id === productId;
        }
      });
      
      setIsInCompareList(exists !== -1);
    } catch (error) {
      setIsInCompareList(false);
    }
  };

  // Toggle compare list
  const toggleCompareList = () => {
    try {
      const savedProducts = localStorage.getItem("compareProducts");
      const compareProducts = savedProducts ? JSON.parse(savedProducts) : [];

      const optionId = selectedOption?.id;
      const productId = product?.id;
      const productName = product?.name;

      // Check if product already exists in compare list
      const existingIndex = compareProducts.findIndex((p) => {
        if (optionId) {
          return p.option_id === optionId;
        } else {
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
          return;
        }

        // Add product to compare list
        const productToAdd = {
          id: productId,
          name: productName,
          option_id: optionId,
          ram: selectedOption?.ram,
          rom: selectedOption?.rom,
          color_name: selectedOption?.colorName,
          price: selectedOption?.price,
          images: product?.image || product?.productImageResponse
        };
        
        compareProducts.push(productToAdd);
        setIsInCompareList(true);
        showNotificationMessage("Sản phẩm đã được thêm vào danh sách so sánh!");
      }

      // Save to localStorage
      localStorage.setItem("compareProducts", JSON.stringify(compareProducts));
      
      // Dispatch event to update compare sidebar
      window.dispatchEvent(new CustomEvent("compareProductsUpdated", {
        detail: { products: compareProducts }
      }));
    } catch (error) {
      console.error("Error toggling compare list:", error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!product)
    return (
      <div className="p-8 text-center text-gray-500">Product not found.</div>
    );

  // Helper render
  const InfoQuick = ({ icon, label, value }) => (
    <div className="flex-1 min-w-[168px] px-2 py-4 bg-zinc-100 rounded-[7px] flex justify-start items-center gap-2">
      {icon}
      <div className="flex-1 justify-start">
        <span className="text-neutral-400 text-sm font-normal font-['Inter'] leading-none">
          {label}
        </span>
        <span className="text-neutral-600 text-sm font-medium font-['Inter'] leading-none block">
          {value}
        </span>
      </div>
    </div>
  );

  // Get unique color list only with available options
  const colorList = Array.from(
    new Set(
      (product.option || [])
        .filter((opt) => opt.remainingQuantity > 0)
        .map((opt) => opt.colorName)
    )
  );
  // Get valid options by each selection
  const optionsByColor = (product.option || []).filter(
    (opt) => opt.colorName === selectedColor && opt.remainingQuantity > 0
  );
  const optionsByColorRam = optionsByColor.filter((opt) =>
    selectedRam ? opt.ram === selectedRam : true
  );
  const optionsByColorRom = optionsByColor.filter((opt) =>
    selectedRom ? opt.rom === selectedRom : true
  );

  // Valid RAM list for selected color and selected ROM, only with available options
  const ramList = Array.from(
    new Set(
      optionsByColorRom
        .filter((opt) => opt.remainingQuantity > 0)
        .map((opt) => opt.ram)
    )
  );
  // Valid ROM list for selected color and selected RAM, only with available options
  const romList = Array.from(
    new Set(
      optionsByColorRam
        .filter((opt) => opt.remainingQuantity > 0)
        .map((opt) => opt.rom)
    )
  );

  // Get all RAM and ROM values from all options of the selected color, only with available options
  const allRomList = Array.from(
    new Set(
      (product.option || [])
        .filter(
          (opt) => opt.colorName === selectedColor && opt.remainingQuantity > 0
        )
        .map((opt) => opt.rom)
    )
  );

  // Get all color, RAM, ROM values from all options (not filtered by selectedColor), only with available options
  const allColorList = Array.from(
    new Set(
      (product.option || [])
        .filter((opt) => opt.remainingQuantity > 0)
        .map((opt) => opt.colorName)
    )
  );
  const allRamList = Array.from(
    new Set(
      (product.option || [])
        .filter((opt) => opt.remainingQuantity > 0)
        .map((opt) => opt.ram)
    )
  );

  // Get full list of values for Details page
  const detailsColorList = Array.from(
    new Set(
      (product?.option || [])
        .filter((opt) => opt && opt.colorName && opt.colorName.trim() !== "")
        .map((opt) => opt.colorName)
    )
  );
  const detailsRamList = Array.from(
    new Set(
      (product?.option || [])
        .filter((opt) => opt && opt.ram != null && !isNaN(opt.ram))
        .map((opt) => opt.ram)
    )
  );
  const detailsRomList = Array.from(
    new Set(
      (product?.option || [])
        .filter((opt) => opt && opt.rom != null && !isNaN(opt.rom))
        .map((opt) => opt.rom)
    )
  );

  // Helper to check validity for Details page
  const isColorValid = (color, ram = selectedRam, rom = selectedRom) => {
    if (!product?.option) return true;
    if (ram != null && rom != null) {
      return product.option.some(
        (opt) =>
          opt && opt.colorName === color && opt.ram === ram && opt.rom === rom
      );
    }
    if (ram != null) {
      return product.option.some(
        (opt) => opt && opt.colorName === color && opt.ram === ram
      );
    }
    if (rom != null) {
      return product.option.some(
        (opt) => opt && opt.colorName === color && opt.rom === rom
      );
    }
    return true;
  };
  const isRamValid = (ram, color = selectedColor, rom = selectedRom) => {
    if (!product?.option) return true;
    if (color != null && rom != null) {
      return product.option.some(
        (opt) =>
          opt && opt.ram === ram && opt.colorName === color && opt.rom === rom
      );
    }
    if (color != null) {
      return product.option.some(
        (opt) => opt.ram === ram && opt.colorName === color
      );
    }
    if (rom != null) {
      return product.option.some((opt) => opt.ram === ram && opt.rom === rom);
    }
    return true;
  };
  const isRomValid = (rom, color = selectedColor, ram = selectedRam) => {
    if (!product?.option) return true;
    if (color != null && ram != null) {
      return product.option.some(
        (opt) => opt.rom === rom && opt.colorName === color && opt.ram === ram
      );
    }
    if (color != null) {
      return product.option.some(
        (opt) => opt.rom === rom && opt.colorName === color
      );
    }
    if (ram != null) {
      return product.option.some((opt) => opt.rom === rom && opt.ram === ram);
    }
    return true;
  };

  // Get color class for display
  const colorClass = (color) => {
    switch (color?.toLowerCase()) {
      case "black":
        return "bg-black";
      case "purple":
        return "bg-purple-700";
      case "red":
        return "bg-red-600";
      case "yellow":
        return "bg-yellow-500";
      case "gray":
        return "bg-gray-200";
      case "white":
        return "bg-white border border-gray-300";
      case "gold":
        return "bg-yellow-300";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="self-stretch px-40 py-10 inline-flex justify-start items-center gap-12">
      {/* Product image and thumbnails */}
      <div className="w-[536px] flex justify-start items-center gap-12">
        <div className="inline-flex flex-col justify-start items-center gap-6">
          {product.image && Array.isArray(product.image) && product.image.length > 0 ? (
            product.image.slice(0, 4).map((img, index) => (
              <img
                key={img.id || index}
                className={`w-[80px] h-[80px] cursor-pointer transition-opacity object-contain bg-gray-100 rounded-lg border-2 ${
                  selectedImageIndex === index ? 'opacity-100 border-blue-500' : 'opacity-60 border-gray-200'
                }`}
                src={img.url || "https://placehold.co/80x80"}
                alt={`thumb${index + 1}`}
                onClick={() => setSelectedImageIndex(index)}
                onError={(e) => {
                  e.target.src = "https://placehold.co/80x80";
                }}
              />
            ))
          ) : product.images && product.images.length > 0 ? (
            product.images.slice(0, 4).map((img, index) => (
              <img
                key={img.id || index}
                className={`w-[80px] h-[80px] cursor-pointer transition-opacity object-contain bg-gray-100 rounded-lg border-2 ${
                  selectedImageIndex === index ? 'opacity-100 border-blue-500' : 'opacity-60 border-gray-200'
                }`}
                src={img.url || "https://placehold.co/80x80"}
                alt={`thumb${index + 1}`}
                onClick={() => setSelectedImageIndex(index)}
                onError={(e) => {
                  e.target.src = "https://placehold.co/80x80";
                }}
              />
            ))
          ) : (
            // Fallback thumbnails if no images
            Array.from({ length: 4 }, (_, index) => (
              <img
                key={index}
                className="w-[80px] h-[80px] opacity-40 object-contain bg-gray-100 rounded-lg border-2 border-gray-200"
                src="https://placehold.co/80x80"
                alt={`thumb${index + 1}`}
              />
            ))
          )}
        </div>
        <img
          className="w-[413.12px] h-[516px] object-contain bg-gray-50 rounded-lg"
          src={
            product.image?.url || 
            product.image?.[selectedImageIndex]?.url ||
            product.productImageResponse?.[selectedImageIndex]?.url ||
            "https://placehold.co/600x800"
          }
          alt="main"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x800";
          }}
        />
      </div>

      {/* Product details */}
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
        {/* Name and price */}
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch justify-start text-black text-[40px] font-bold font-['Inter'] leading-10">
              {product.name}
            </div>
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="justify-start text-black text-[32px] font-medium font-['Inter'] leading-[48px] tracking-wide">
                {selectedOption && selectedOption.price != null
                  ? `${selectedOption.price.toLocaleString("vi-VN")}₫`
                  : product.price != null
                  ? `${product.price.toLocaleString("vi-VN")}₫`
                  : ""}
              </div>
            </div>
          </div>
          {/* Select color */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="justify-center text-neutral-950 text-[15px] font-normal font-['Inter'] leading-normal">
                Select color :
              </div>
              <div className="flex-1 self-stretch pr-[246px] flex justify-start items-center gap-2">
                {allColorList.length > 0 ? (
                  allColorList.map((color, idx) => {
                    const state = getColorState(color);
                    const isSelected = state === "selected";
                    const isAvailable = state === "available";
                    const isUnavailable = state === "unavailable";

                    return (
                      <button
                        key={color}
                        className={`flex items-center gap-2 px-3 py-1 text-sm rounded-full border transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-700 cursor-pointer"
                            : isAvailable
                            ? "border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                            : "border-gray-200 bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() => handleColorSelect(color)}
                        disabled={isUnavailable}
                      >
                        <div
                          className={`w-4 h-4 rounded-full ${colorClass(
                            color
                          )} ${isUnavailable ? "opacity-50" : ""}`}
                        />
                        <span
                          className={`text-sm font-normal font-['Inter'] leading-normal ${
                            isSelected
                              ? "text-blue-700"
                              : isAvailable
                              ? "text-neutral-700"
                              : "text-gray-400"
                          }`}
                        >
                          {color}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="size-8 bg-gray-200 rounded-full" />
                )}
              </div>
            </div>
            {/* Select RAM and ROM on the same row */}
            <div className="self-stretch flex flex-row gap-8">
              {/* RAM */}
              <div className="flex flex-col gap-1">
                <div className="text-xs text-gray-500 mb-1 ml-1">
                  Choose the RAM capacity that fits your needs
                </div>
                <div className="inline-flex justify-start items-center gap-2">
                  {allRamList.map((ram, idx) => {
                    const state = getRamState(ram);
                    const isSelected = state === "selected";
                    const isAvailable = state === "available";
                    const isUnavailable = state === "unavailable";

                    return (
                      <button
                        key={ram}
                        className={`px-4 py-2 text-base rounded-lg border transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-600 font-bold cursor-pointer"
                            : isAvailable
                            ? "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                            : "border-gray-200 bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed"
                        } flex justify-center items-center gap-2 text-xs`}
                        onClick={() => handleRamSelect(ram)}
                        disabled={isUnavailable}
                      >
                        {ram}GB
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* ROM */}
              <div className="flex flex-col gap-1">
                <div className="text-xs text-gray-500 mb-1 ml-1">
                  Choose the ROM storage that fits your needs
                </div>
                <div className="inline-flex justify-start items-center gap-2">
                  {allRomList.map((rom, idx) => {
                    const state = getRomState(rom);
                    const isSelected = state === "selected";
                    const isAvailable = state === "available";
                    const isUnavailable = state === "unavailable";

                    return (
                      <button
                        key={rom}
                        className={`px-4 py-2 text-base rounded-lg border transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-600 font-bold cursor-pointer"
                            : isAvailable
                            ? "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 cursor-pointer"
                            : "border-gray-200 bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed"
                        } flex justify-center items-center gap-2 text-xs`}
                        onClick={() => handleRomSelect(rom)}
                        disabled={isUnavailable}
                      >
                        {rom}GB
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Quick info */}
            <div className="self-stretch inline-flex justify-start items-start gap-4 flex-wrap content-start">
              <InfoQuick
                icon={<MdPhoneIphone className="text-2xl text-neutral-600" />}
                label="Screen size"
                value={product.screenDimension || "N/A"}
              />
              <InfoQuick
                icon={<FaMicrochip className="text-2xl text-neutral-600" />}
                label="CPU"
                value={product.cpu || "N/A"}
              />
              <InfoQuick
                icon={<FaMicrochip className="text-2xl text-neutral-600" />}
                label="CPU Speed"
                value={product.cpuSpeed ? `${product.cpuSpeed} GHz` : "N/A"}
              />
              <InfoQuick
                icon={<FaCamera className="text-2xl text-neutral-600" />}
                label="Main camera"
                value={product.backCamera || "N/A"}
              />
              <InfoQuick
                icon={<FaCameraRetro className="text-2xl text-neutral-600" />}
                label="Front-camera"
                value={product.frontCamera || "N/A"}
              />
              <InfoQuick
                icon={<MdBatteryFull className="text-2xl text-neutral-600" />}
                label="Battery capacity"
                value={
                  product.batteryCapacity
                    ? `${product.batteryCapacity} mAh`
                    : "N/A"
                }
              />
              {/* Ram and Rom */}
            </div>
            {/* Short description */}
            <div className="self-stretch h-[72px] justify-start">
              <span className="text-neutral-500 text-sm font-normal font-['Inter'] leading-normal tracking-wide">
                {product.description || "No description."}
              </span>
            </div>
            {/* Store selection - moved here, right below description */}
            {Array.isArray(product.stores) && product.stores.length > 0 && (
              <div className="mb-2 w-full">
                <label className="mr-2 font-medium">Store:</label>
                <select
                  value={selectedStore?.id || ""}
                  onChange={(e) => {
                    const store = product.stores.find(
                      (s) => s.id === Number(e.target.value)
                    );
                    setSelectedStore(store);
                  }}
                  className="border rounded px-2 py-1"
                >
                  {product.stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                      {store.location ? ` - ${store.location}` : ""}
                    </option>
                  ))}
                </select>
                {selectedStore && (
                  <div className="text-sm text-gray-600 mt-1">
                    Address: {selectedStore.location}
                  </div>
                )}
              </div>
            )}
            {/* Wishlist and add to cart buttons */}
            <div className="self-stretch inline-flex justify-start items-start gap-4 flex-wrap content-start">
              <button
                className="flex-1 min-w-[136px] px-14 py-4 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-black flex justify-center items-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handlePreOrder}
              >
                <div className="text-center justify-start text-black text-base font-medium font-['Inter'] leading-normal">
                  Pre Order NOW
                </div>
              </button>
              <div className="flex-1 min-w-[136px] px-14 py-4 bg-black rounded-md flex justify-center items-center gap-2">
                <button
                  className="text-center justify-start text-white text-base font-medium font-['Inter'] leading-normal w-full bg-black  transition rounded-md disabled:opacity-60 cursor-pointer"
                  onClick={handleAddToCart}
                  disabled={addToCartLoading}
                >
                  {addToCartLoading ? "Adding..." : "Add to Cart"}
                </button>
              </div>
              <button
                onClick={toggleCompareList}
                className="flex-1 min-w-[136px] px-14 py-4 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Scale size={16} />
                <span className="text-base font-medium font-['Inter'] leading-normal">
                  {isInCompareList ? "Remove" : "Compare"}
                </span>
              </button>
            </div>

            
            {/* Buy Now button - new row */}
            <div className="self-stretch mt-3">
              <button
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-md shadow transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                onClick={handleBuyNow}
                disabled={
                  !selectedOption ||
                  !selectedOption.remainingQuantity ||
                  addToCartLoading
                }
              >
                Buy Now
              </button>
            </div>
            {/* Shipping and warranty info */}
            <div className="self-stretch inline-flex justify-start items-center gap-8">
              {/* Free Delivery */}
              <div className="flex-1 rounded-lg flex justify-start items-center gap-4">
                <div className="p-4 bg-neutral-100 rounded-[11px] flex justify-center items-center">
                  <FaTruck className="text-2xl text-neutral-600" />
                </div>
                <div className="justify-start">
                  <span className="text-neutral-500 text-sm font-medium font-['Inter'] leading-normal">
                    Free Delivery
                    <br />
                  </span>
                  <span className="text-black text-sm font-medium font-['Inter'] leading-normal">
                    1-2 day
                  </span>
                </div>
              </div>
              {/* Stock Status */}
              <div className="flex-1 rounded-lg flex justify-start items-center gap-4">
                <div className="p-4 bg-neutral-100 rounded-[11px] flex justify-center items-center">
                  {selectedOption && selectedOption.remainingQuantity > 0 ? (
                    <FaCheckCircle className="text-2xl text-green-600" />
                  ) : (
                    <FaTimesCircle className="text-2xl text-red-600" />
                  )}
                </div>
                <div className="justify-start">
                  <span className="text-neutral-500 text-sm font-medium font-['Inter'] leading-normal">
                    {selectedOption && selectedOption.remainingQuantity > 0 ? "In Stock" : "Out of Stock"}
                    <br />
                  </span>
                  <span className={`text-sm font-medium font-['Inter'] leading-normal ${
                    selectedOption && selectedOption.remainingQuantity > 0 ? "text-black" : "text-red-600"
                  }`}>
                    {selectedOption && selectedOption.remainingQuantity > 0 ? "Today" : "Unavailable"}
                  </span>
                </div>
              </div>
              {/* Guaranteed */}
              <div className="flex-1 rounded-lg flex justify-start items-center gap-4">
                <div className="p-4 bg-neutral-100 rounded-[11px] flex justify-center items-center">
                  <FaShieldAlt className="text-2xl text-blue-600" />
                </div>
                <div className="justify-start">
                  <span className="text-neutral-500 text-sm font-medium font-['Inter'] leading-normal">
                    Guaranteed
                    <br />
                  </span>
                  <span className="text-black text-sm font-medium font-['Inter'] leading-normal">
                    {product.warranty?.duration
                      ? `${product.warranty.duration} months`
                      : "12 months"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductLayout;
