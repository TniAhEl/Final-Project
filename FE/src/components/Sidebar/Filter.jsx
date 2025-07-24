import React, { useState, useEffect, useRef } from "react";
import {
  MdCategory,
  MdMemory,
  MdStorage,
  MdBrandingWatermark,
  MdExpandMore,
  MdExpandLess,
  MdAttachMoney,
  MdClear,
} from "react-icons/md";
import { filterProducts } from "../../api/productService";

const filterMenu = [
  {
    label: "Category",
    icon: <MdCategory className="text-lg text-gray-700" />,
    key: "category",
  },
  {
    label: "Brand",
    icon: <MdBrandingWatermark className="text-lg text-gray-700" />,
    key: "brand",
  },
  {
    label: "RAM",
    icon: <MdMemory className="text-lg text-gray-700" />,
    key: "ram",
  },
  {
    label: "ROM",
    icon: <MdStorage className="text-lg text-gray-700" />,
    key: "rom",
  },
  {
    label: "Price",
    icon: <MdAttachMoney className="text-lg text-gray-700" />,
    key: "price",
  },
];

const FilterBar = ({
  categories = [],
  brands = [],
  rams = [],
  roms = [],
  minPrice = 0,
  maxPrice = 5000,
  onFilterChange = () => {},
  onDebounceChange = () => {}, // thêm prop mới
  initialFilters = {},
}) => {
  const optionsMap = {
    category: categories,
    brand: brands,
    ram: rams,
    rom: roms,
  };

  // State cho các mục đang mở (dropdown)
  const [openDropdown, setOpenDropdown] = useState(null);
  // State cho giá
  const [price, setPrice] = useState([minPrice, maxPrice]);
  // State cho các filter đã chọn (multi-select)
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    brand: [],
    ram: [],
    rom: [],
    price: [minPrice, maxPrice],
  });
  // State cho loading
  const [isLoading, setIsLoading] = useState(false);
  // Ref cho debounce
  const debounceRef = useRef();

  // Thêm các khoảng giá nhanh
  const quickPriceRanges = [
    { label: "Under 2 million", value: [0, 2000000] },
    { label: "From 2 - 4 million", value: [2000000, 4000000] },
    { label: "From 4 - 7 million", value: [4000000, 7000000] },
    { label: "From 7 - 13 million", value: [7000000, 13000000] },
    { label: "From 13 - 20 million", value: [13000000, 20000000] },
    { label: "Over 20 million", value: [20000000, maxPrice] },
  ];

  // Accordion cho chọn giá tuỳ chỉnh
  const [showCustomPrice, setShowCustomPrice] = useState(false);

  // Thay đổi: Thêm state lưu giá trị raw input cho từng ô nhập giá
  const [priceInput, setPriceInput] = useState([
    minPrice.toString(),
    maxPrice.toString(),
  ]);

  // Thêm state lưu index option giá nhanh đang chọn, null nếu không chọn
  const [selectedQuickPriceIdx, setSelectedQuickPriceIdx] = useState(null);

  // Function to create filter object to send to API
  const createFilterObject = () => {
    const filter = {};
    if (activeFilters.category.length > 0)
      filter.category = activeFilters.category;
    if (activeFilters.brand.length > 0) filter.brand = activeFilters.brand;
    if (activeFilters.ram.length > 0) filter.ram = activeFilters.ram;
    if (activeFilters.rom.length > 0) filter.rom = activeFilters.rom;
    if (
      activeFilters.price[0] !== minPrice ||
      activeFilters.price[1] !== maxPrice
    ) {
      filter.minPrice = activeFilters.price[0];
      filter.maxPrice = activeFilters.price[1];
    }
    return filter;
  };

  // Function to call filter API
  const applyFilters = async () => {
    setIsLoading(true);
    try {
      const filterObject = createFilterObject();
      onFilterChange(filterObject);
    } catch (error) {
      console.error("Error filtering products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce: only send filter object outside after 0.5s without changes
  useEffect(() => {
    if (
      Object.keys(activeFilters).every((key) =>
        key === "price"
          ? activeFilters[key][0] === minPrice &&
            activeFilters[key][1] === maxPrice
          : activeFilters[key].length === 0
      )
    ) {
      onFilterChange({});
      onDebounceChange(false);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onDebounceChange(true); // notify parent that debouncing
    debounceRef.current = setTimeout(() => {
      onFilterChange(createFilterObject());
      onDebounceChange(false); // notify parent that debounce is done
    }, 200);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [activeFilters]);

  // When initialFilters changes, set activeFilters (only run once when mount)
  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      const newActiveFilters = {
        category: [],
        brand: [],
        ram: [],
        rom: [],
        price: [minPrice, maxPrice],
      };

      // Process regular filters
      ["category", "brand", "ram", "rom"].forEach((key) => {
        if (initialFilters[key]) {
          newActiveFilters[key] = Array.isArray(initialFilters[key])
            ? initialFilters[key]
            : [initialFilters[key]];
        }
      });

      // Process price
      if (
        initialFilters.minPrice !== undefined ||
        initialFilters.maxPrice !== undefined
      ) {
        newActiveFilters.price = [
          initialFilters.minPrice !== undefined
            ? Number(initialFilters.minPrice)
            : minPrice,
          initialFilters.maxPrice !== undefined
            ? Number(initialFilters.maxPrice)
            : maxPrice,
        ];
        setPrice(newActiveFilters.price);
      }

      setActiveFilters(newActiveFilters);
    }
    // eslint-disable-next-line
  }, []); // Only run once when mount

  // Dropdown: only open 1 dropdown at a time
  const handleToggleDropdown = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  // Multi-select for filter
  const handleFilterChange = (key, value) => {
    if (key === "price") {
      setActiveFilters((prev) => ({ ...prev, price: value }));
    } else {
      setActiveFilters((prev) => {
        const arr = prev[key];
        let newArr;
        if (arr.includes(value)) {
          newArr = arr.filter((v) => v !== value);
        } else {
          newArr = [...arr, value];
        }
        return { ...prev, [key]: newArr };
      });
    }
  };

  // Fix handlePriceInputChange and handlePriceChange to deselect quick price option when typing or dragging slider
  const handlePriceInputChange = (e, idx) => {
    let raw = e.target.value.replace(/[^0-9]/g, "");
    if (!raw || Number(raw) < 1000) {
      raw = "1000";
    }
    setPriceInput((prev) => {
      const next = [...prev];
      next[idx] = raw;
      return next;
    });
    let num = Number(raw);
    let newPrice = [...price];
    newPrice[idx] = num;
    if (newPrice[0] > newPrice[1]) {
      if (idx === 0) newPrice[1] = newPrice[0];
      else newPrice[0] = newPrice[1];
    }
    setSelectedQuickPriceIdx(null); // Deselect quick price option
    setPrice(newPrice);
    handleFilterChange("price", newPrice);
  };

  const handlePriceChange = (e, idx) => {
    const newPrice = [...price];
    newPrice[idx] = Number(e.target.value);
    if (newPrice[0] > newPrice[1]) {
      if (idx === 0) newPrice[1] = newPrice[0];
      else newPrice[0] = newPrice[1];
    }
    setSelectedQuickPriceIdx(null); // Deselect quick price option
    setPrice(newPrice);
    handleFilterChange("price", newPrice);
  };

  // Fix handleQuickPrice
  const handleQuickPrice = (range, idx) => {
    setSelectedQuickPriceIdx(idx);
    setPrice(range);
    setActiveFilters((prev) => ({ ...prev, price: range }));
  };

  // When selecting quick or slider, sync raw input
  useEffect(() => {
    setPriceInput([
      price[0] ? price[0].toString() : "1000",
      price[1] ? price[1].toString() : "1000",
    ]);
  }, [price[0], price[1]]);

  const clearAllFilters = () => {
    setActiveFilters({
      category: [],
      brand: [],
      ram: [],
      rom: [],
      price: [minPrice, maxPrice],
    });
    setPrice([minPrice, maxPrice]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".filter-dropdown")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Render selected filters
  const renderSelectedFilters = () => {
    const selected = [];
    Object.entries(activeFilters).forEach(([key, values]) => {
      if (key !== "price" && values.length > 0) {
        values.forEach((value) => {
          selected.push({ key, value });
        });
      }
    });

    if (selected.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {selected.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
          >
            <span>{item.value}</span>
            <button
              onClick={() => handleFilterChange(item.key, item.value)}
              className="ml-1 hover:text-blue-600"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200"
        >
          <MdClear className="text-sm" />
          Clear All
        </button>
      </div>
    );
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {filterMenu.map((item) => (
            <div key={item.key} className="relative filter-dropdown">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  openDropdown === item.key
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
                onClick={() => handleToggleDropdown(item.key)}
              >
                <span className="flex items-center justify-center">
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
                {openDropdown === item.key ? (
                  <MdExpandLess className="text-lg" />
                ) : (
                  <MdExpandMore className="text-lg" />
                )}
              </button>

              {/* Dropdown content */}
              {openDropdown === item.key && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                  {item.key !== "price" ? (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Select {item.label}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {optionsMap[item.key].map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleFilterChange(item.key, opt)}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${
                              activeFilters[item.key].includes(opt)
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-base font-semibold text-gray-800 mb-2">
                        Price
                      </div>
                      {/* Quick price range button */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {quickPriceRanges.map((range, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickPrice(range.value, idx)}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${
                              selectedQuickPriceIdx === idx
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                      {/* Accordion for custom price */}
                      <button
                        className="flex items-center gap-1 text-blue-600 text-sm font-medium focus:outline-none mb-2"
                        onClick={() => setShowCustomPrice((v) => !v)}
                        type="button"
                      >
                        <MdAttachMoney className="inline-block" />
                        Or choose a price range that suits you
                        {showCustomPrice ? <MdExpandLess /> : <MdExpandMore />}
                      </button>
                      {showCustomPrice && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              inputMode="numeric"
                              min={minPrice}
                              max={price[1]}
                              value={Number(priceInput[0]).toLocaleString(
                                "vi-VN"
                              )}
                              onChange={(e) => handlePriceInputChange(e, 0)}
                              className="w-24 border rounded px-2 py-1 text-sm text-right"
                            />
                            <span className="text-gray-500">đ</span>
                            <span className="text-gray-400">-</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              min={price[0]}
                              max={maxPrice}
                              value={Number(priceInput[1]).toLocaleString(
                                "vi-VN"
                              )}
                              onChange={(e) => handlePriceInputChange(e, 1)}
                              className="w-24 border rounded px-2 py-1 text-sm text-right"
                            />
                            <span className="text-gray-500">đ</span>
                          </div>
                          {/* Slider remains the same */}
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={minPrice}
                              max={maxPrice}
                              step={100000}
                              value={price[0]}
                              onChange={(e) => handlePriceChange(e, 0)}
                              className="w-full accent-blue-500"
                            />
                            <input
                              type="range"
                              min={minPrice}
                              max={maxPrice}
                              step={100000}
                              value={price[1]}
                              onChange={(e) => handlePriceChange(e, 1)}
                              className="w-full accent-blue-500"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{price[0].toLocaleString("vi-VN")}đ</span>
                            <span>{price[1].toLocaleString("vi-VN")}đ</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            Filtering...
          </div>
        )}
      </div>

      {/* Selected filters display */}
      {renderSelectedFilters()}
    </div>
  );
};

export default FilterBar;
