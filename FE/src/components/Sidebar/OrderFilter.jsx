import { useState, useEffect, useRef } from "react";
import {
  MdExpandMore,
  MdExpandLess,
  MdAttachMoney,
  MdClear,
  MdDateRange,
  MdLocalShipping,
  MdReceipt,
  MdDiscount,
} from "react-icons/md";

const filterMenu = [
  {
    label: "Client Type",
    icon: <MdReceipt className="text-lg text-gray-700" />,
    key: "type",
  },
  {
    label: "Status",
    icon: <MdLocalShipping className="text-lg text-gray-700" />,
    key: "status",
  },
  {
    label: "Promotion",
    icon: <MdDiscount className="text-lg text-gray-700" />,
    key: "promotion",
  },
  {
    label: "Date Range",
    icon: <MdDateRange className="text-lg text-gray-700" />,
    key: "date",
  },
  {
    label: "Total Money",
    icon: <MdAttachMoney className="text-lg text-gray-700" />,
    key: "money",
  },
];

const OrderFilter = ({
  types = [],
  statuses = [],
  promotionCodes = [],
  minTotalMoney = 0,
  maxTotalMoney = 100000000,
  onFilterChange = () => {},
  onDebounceChange = () => {},
  initialFilters = {},
}) => {
  const optionsMap = {
    type: types,
    status: statuses,
    promotion: promotionCodes,
  };

  // State for dropdowns
  const [openDropdown, setOpenDropdown] = useState(null);

  // State for date range
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State for total money range
  const [minMoney, setMinMoney] = useState(minTotalMoney);
  const [maxMoney, setMaxMoney] = useState(maxTotalMoney);
  const [moneyInput, setMoneyInput] = useState([
    minTotalMoney.toString(),
    maxTotalMoney.toString(),
  ]);

  // State for selected filters
  const [activeFilters, setActiveFilters] = useState({
    type: [],
    status: [],
    promotion: [],
    startDate: "",
    endDate: "",
    minTotalMoney: minTotalMoney,
    maxTotalMoney: maxTotalMoney,
  });

  // State for loading
  const [isLoading, setIsLoading] = useState(false);

  // Ref for debounce
  const debounceRef = useRef();

  // Quick money ranges
  const quickMoneyRanges = [
    { label: "Under 1 million", value: [0, 1000000] },
    { label: "1 - 5 million", value: [1000000, 5000000] },
    { label: "5 - 10 million", value: [5000000, 10000000] },
    { label: "10 - 20 million", value: [10000000, 20000000] },
    { label: "Over 20 million", value: [20000000, maxTotalMoney] },
  ];

  // Accordion for custom money range
  const [showCustomMoney, setShowCustomMoney] = useState(false);
  const [selectedQuickMoneyIdx, setSelectedQuickMoneyIdx] = useState(null);

  // Function to create filter object to send to API
  const createFilterObject = () => {
    const filter = {};
    if (activeFilters.type.length > 0) filter.types = activeFilters.type;
    if (activeFilters.status.length > 0) filter.statuses = activeFilters.status;
    if (activeFilters.promotion.length > 0)
      filter.promotionCodes = activeFilters.promotion;
    if (activeFilters.startDate) filter.startDate = activeFilters.startDate;
    if (activeFilters.endDate) filter.endDate = activeFilters.endDate;
    if (
      activeFilters.minTotalMoney !== minTotalMoney ||
      activeFilters.maxTotalMoney !== maxTotalMoney
    ) {
      filter.minTotalMoney = activeFilters.minTotalMoney;
      filter.maxTotalMoney = activeFilters.maxTotalMoney;
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
      console.error("Error filtering orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce: only send filter object outside after 0.5s without changes
  useEffect(() => {
    if (
      Object.keys(activeFilters).every((key) =>
        key === "minTotalMoney" || key === "maxTotalMoney"
          ? activeFilters[key] ===
            (key === "minTotalMoney" ? minTotalMoney : maxTotalMoney)
          : key === "startDate" || key === "endDate"
          ? activeFilters[key] === ""
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
    }, 500); // Changed to 0.5s as requested
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line
  }, [activeFilters]);

  // When initialFilters changes, set activeFilters (only run once when mount)
  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      const newActiveFilters = {
        type: [],
        status: [],
        promotion: [],
        startDate: "",
        endDate: "",
        minTotalMoney: minTotalMoney,
        maxTotalMoney: maxTotalMoney,
      };

      // Process regular filters
      ["types", "statuses", "promotionCodes"].forEach((key) => {
        const filterKey =
          key === "types"
            ? "type"
            : key === "statuses"
            ? "status"
            : "promotion";
        if (initialFilters[key]) {
          newActiveFilters[filterKey] = Array.isArray(initialFilters[key])
            ? initialFilters[key]
            : [initialFilters[key]];
        }
      });

      // Process date range
      if (initialFilters.startDate) {
        newActiveFilters.startDate = initialFilters.startDate;
        setStartDate(initialFilters.startDate);
      }
      if (initialFilters.endDate) {
        newActiveFilters.endDate = initialFilters.endDate;
        setEndDate(initialFilters.endDate);
      }

      // Process money range
      if (
        initialFilters.minTotalMoney !== undefined ||
        initialFilters.maxTotalMoney !== undefined
      ) {
        newActiveFilters.minTotalMoney =
          initialFilters.minTotalMoney !== undefined
            ? Number(initialFilters.minTotalMoney)
            : minTotalMoney;
        newActiveFilters.maxTotalMoney =
          initialFilters.maxTotalMoney !== undefined
            ? Number(initialFilters.maxTotalMoney)
            : maxTotalMoney;
        setMinMoney(newActiveFilters.minTotalMoney);
        setMaxMoney(newActiveFilters.maxTotalMoney);
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
  };

  // Handle date changes
  const handleDateChange = (field, value) => {
    setActiveFilters((prev) => ({ ...prev, [field]: value }));
    if (field === "startDate") setStartDate(value);
    if (field === "endDate") setEndDate(value);
  };

  // Handle money input changes
  const handleMoneyInputChange = (e, idx) => {
    let raw = e.target.value.replace(/[^0-9]/g, "");
    if (!raw || Number(raw) < 0) {
      raw = "0";
    }
    setMoneyInput((prev) => {
      const next = [...prev];
      next[idx] = raw;
      return next;
    });
    let num = Number(raw);
    let newMinMoney = minMoney;
    let newMaxMoney = maxMoney;
    if (idx === 0) {
      newMinMoney = num;
    } else {
      newMaxMoney = num;
    }
    if (newMinMoney > newMaxMoney) {
      if (idx === 0) newMaxMoney = newMinMoney;
      else newMinMoney = newMaxMoney;
    }
    setSelectedQuickMoneyIdx(null); // Deselect quick money option
    setMinMoney(newMinMoney);
    setMaxMoney(newMaxMoney);
    setActiveFilters((prev) => ({
      ...prev,
      minTotalMoney: newMinMoney,
      maxTotalMoney: newMaxMoney,
    }));
  };

  const handleMoneyChange = (e, idx) => {
    const newMinMoney = idx === 0 ? Number(e.target.value) : minMoney;
    const newMaxMoney = idx === 1 ? Number(e.target.value) : maxMoney;
    if (newMinMoney > newMaxMoney) {
      if (idx === 0) {
        setMaxMoney(newMinMoney);
        setActiveFilters((prev) => ({
          ...prev,
          minTotalMoney: newMinMoney,
          maxTotalMoney: newMinMoney,
        }));
      } else {
        setMinMoney(newMaxMoney);
        setActiveFilters((prev) => ({
          ...prev,
          minTotalMoney: newMaxMoney,
          maxTotalMoney: newMaxMoney,
        }));
      }
    } else {
      setActiveFilters((prev) => ({
        ...prev,
        minTotalMoney: newMinMoney,
        maxTotalMoney: newMaxMoney,
      }));
    }
    setSelectedQuickMoneyIdx(null); // Deselect quick money option
    if (idx === 0) setMinMoney(newMinMoney);
    else setMaxMoney(newMaxMoney);
  };

  // Handle quick money selection
  const handleQuickMoney = (range, idx) => {
    setSelectedQuickMoneyIdx(idx);
    setMinMoney(range[0]);
    setMaxMoney(range[1]);
    setActiveFilters((prev) => ({
      ...prev,
      minTotalMoney: range[0],
      maxTotalMoney: range[1],
    }));
  };

  // Sync money input when money values change
  useEffect(() => {
    setMoneyInput([
      minMoney ? minMoney.toString() : "0",
      maxMoney ? maxMoney.toString() : "0",
    ]);
  }, [minMoney, maxMoney]);

  const clearAllFilters = () => {
    setActiveFilters({
      type: [],
      status: [],
      promotion: [],
      startDate: "",
      endDate: "",
      minTotalMoney: minTotalMoney,
      maxTotalMoney: maxTotalMoney,
    });
    setStartDate("");
    setEndDate("");
    setMinMoney(minTotalMoney);
    setMaxMoney(maxTotalMoney);
    setSelectedQuickMoneyIdx(null);
    setShowCustomMoney(false);
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
      if (
        key !== "minTotalMoney" &&
        key !== "maxTotalMoney" &&
        key !== "startDate" &&
        key !== "endDate" &&
        values.length > 0
      ) {
        values.forEach((value) => {
          const label =
            key === "type"
              ? "Client Type"
              : key === "status"
              ? "Status"
              : key === "promotion"
              ? "Promotion"
              : key;
          selected.push({ key, value: `${label}: ${value}` });
        });
      }
    });

    // Add date range if selected
    if (activeFilters.startDate || activeFilters.endDate) {
      const dateRange = `Date: ${activeFilters.startDate || "Any"} - ${
        activeFilters.endDate || "Any"
      }`;
      selected.push({ key: "dateRange", value: dateRange });
    }

    // Add money range if custom
    if (
      activeFilters.minTotalMoney !== minTotalMoney ||
      activeFilters.maxTotalMoney !== maxTotalMoney
    ) {
      const moneyRange = `Money: ${activeFilters.minTotalMoney.toLocaleString(
        "en-US"
      )} - ${activeFilters.maxTotalMoney.toLocaleString("en-US")} VND`;
      selected.push({ key: "moneyRange", value: moneyRange });
    }

    if (selected.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {selected.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
          >
            <span>{item.value}</span>
            {item.key !== "dateRange" && item.key !== "moneyRange" && (
              <button
                onClick={() => {
                  const actualValue = item.value.split(": ")[1]; // Remove label prefix
                  if (item.key === "type") {
                    setActiveFilters((prev) => ({
                      ...prev,
                      type: prev.type.filter((v) => v !== actualValue),
                    }));
                  } else if (item.key === "status") {
                    setActiveFilters((prev) => ({
                      ...prev,
                      status: prev.status.filter((v) => v !== actualValue),
                    }));
                  } else if (item.key === "promotion") {
                    setActiveFilters((prev) => ({
                      ...prev,
                      promotion: prev.promotion.filter(
                        (v) => v !== actualValue
                      ),
                    }));
                  }
                }}
                className="ml-1 hover:text-blue-600"
              >
                ×
              </button>
            )}
            {(item.key === "dateRange" || item.key === "moneyRange") && (
              <button
                onClick={() => {
                  if (item.key === "dateRange") {
                    setActiveFilters((prev) => ({
                      ...prev,
                      startDate: "",
                      endDate: "",
                    }));
                    setStartDate("");
                    setEndDate("");
                  } else if (item.key === "moneyRange") {
                    setActiveFilters((prev) => ({
                      ...prev,
                      minTotalMoney: minTotalMoney,
                      maxTotalMoney: maxTotalMoney,
                    }));
                    setMinMoney(minTotalMoney);
                    setMaxMoney(maxTotalMoney);
                    setSelectedQuickMoneyIdx(null);
                  }
                }}
                className="ml-1 hover:text-blue-600"
              >
                ×
              </button>
            )}
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
                  {item.key === "date" ? (
                    <div className="space-y-3">
                      <div className="text-base font-semibold text-gray-800 mb-2">
                        Date Range
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            Start Date
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                              handleDateChange("startDate", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) =>
                              handleDateChange("endDate", e.target.value)
                            }
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ) : item.key === "money" ? (
                    <div className="space-y-3">
                      <div className="text-base font-semibold text-gray-800 mb-2">
                        Total Money
                      </div>
                      {/* Quick money range buttons */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {quickMoneyRanges.map((range, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleQuickMoney(range, idx)}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-200 ${
                              selectedQuickMoneyIdx === idx
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {range.label}
                          </button>
                        ))}
                      </div>
                      {/* Accordion for custom money range */}
                      <button
                        className="flex items-center gap-1 text-blue-600 text-sm font-medium focus:outline-none mb-2"
                        onClick={() => setShowCustomMoney((v) => !v)}
                        type="button"
                      >
                        <MdAttachMoney className="inline-block" />
                        Or choose a custom money range
                        {showCustomMoney ? <MdExpandLess /> : <MdExpandMore />}
                      </button>
                      {showCustomMoney && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              inputMode="numeric"
                              min={0}
                              max={maxMoney}
                              value={Number(moneyInput[0]).toLocaleString(
                                "en-US"
                              )}
                              onChange={(e) => handleMoneyInputChange(e, 0)}
                              className="w-24 border rounded px-2 py-1 text-sm text-right"
                            />
                            <span className="text-gray-500">VND</span>
                            <span className="text-gray-400">-</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              min={minMoney}
                              max={maxTotalMoney}
                              value={Number(moneyInput[1]).toLocaleString(
                                "en-US"
                              )}
                              onChange={(e) => handleMoneyInputChange(e, 1)}
                              className="w-24 border rounded px-2 py-1 text-sm text-right"
                            />
                            <span className="text-gray-500">VND</span>
                          </div>
                          {/* Slider */}
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={0}
                              max={maxTotalMoney}
                              step={100000}
                              value={minMoney}
                              onChange={(e) => handleMoneyChange(e, 0)}
                              className="w-full accent-blue-500"
                            />
                            <input
                              type="range"
                              min={0}
                              max={maxTotalMoney}
                              step={100000}
                              value={maxMoney}
                              onChange={(e) => handleMoneyChange(e, 1)}
                              className="w-full accent-blue-500"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{minMoney.toLocaleString("en-US")} VND</span>
                            <span>{maxMoney.toLocaleString("en-US")} VND</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Select{" "}
                        {item.key === "type" ? "Client Type" : item.label}
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

export default OrderFilter;
