import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProductCard = (product) => {
  if (!product || (!product.id && !product.name && !product.option && !product.category)) {
    return (
      <div className="w-[280px] h-[480px] bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-300 overflow-hidden shadow-md flex items-center justify-center">
        <span className="text-gray-400 text-sm">Không có dữ liệu sản phẩm</span>
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
    productImageResponse
  } = product;
  
  const navigate = useNavigate();
  
  // State cho option selection
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedRom, setSelectedRom] = useState(null);
  
  // Lấy danh sách đầy đủ các giá trị
  const colorList = Array.from(new Set((option || []).filter(opt => opt && opt.colorName && opt.colorName.trim() !== '').map(opt => opt.colorName)));
  const ramList = Array.from(new Set((option || []).filter(opt => opt && opt.ram != null && !isNaN(opt.ram)).map(opt => opt.ram)));
  const romList = Array.from(new Set((option || []).filter(opt => opt && opt.rom != null && !isNaN(opt.rom)).map(opt => opt.rom)));

  // Helper kiểm tra hợp lệ
  const isColorValid = (color, ram = selectedRam, rom = selectedRom) => {
    if (!option) return true;
    if (ram != null && rom != null) {
      return option.some(opt => opt && opt.colorName === color && opt.ram === ram && opt.rom === rom);
    }
    if (ram != null) {
      return option.some(opt => opt && opt.colorName === color && opt.ram === ram);
    }
    if (rom != null) {
      return option.some(opt => opt && opt.colorName === color && opt.rom === rom);
    }
    return true;
  };
  const isRamValid = (ram, color = selectedColor, rom = selectedRom) => {
    if (!option) return true;
    if (color != null && rom != null) {
      return option.some(opt => opt && opt.ram === ram && opt.colorName === color && opt.rom === rom);
    }
    if (color != null) {
      return option.some(opt => opt && opt.ram === ram && opt.colorName === color);
    }
    if (rom != null) {
      return option.some(opt => opt && opt.ram === ram && opt.rom === rom);
    }
    return true;
  };
  const isRomValid = (rom, color = selectedColor, ram = selectedRam) => {
    if (!option) return true;
    if (color != null && ram != null) {
      return option.some(opt => opt && opt.rom === rom && opt.colorName === color && opt.ram === ram);
    }
    if (color != null) {
      return option.some(opt => opt && opt.rom === rom && opt.colorName === color);
    }
    if (ram != null) {
      return option.some(opt => opt && opt.rom === rom && opt.ram === ram);
    }
    return true;
  };

  // Khởi tạo options khi component mount
  useEffect(() => {
    if (option && Array.isArray(option) && option.length > 0) {
      const firstValidOption = option.find(opt => opt && opt.colorName && opt.colorName.trim() !== '');
      if (firstValidOption) {
        setSelectedOption(firstValidOption);
        setSelectedColor(firstValidOption.colorName);
        setSelectedRam(firstValidOption.ram || null);
        setSelectedRom(firstValidOption.rom || null);
      }
    }
  }, [option]);

  // Khi chọn 1 option, nếu selection hiện tại không còn hợp lệ, tự động chuyển sang option hợp lệ đầu tiên giữ giá trị vừa chọn
  useEffect(() => {
    if (!option || !Array.isArray(option)) return;
    // Nếu selection hiện tại hợp lệ thì giữ nguyên
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
    // Nếu không hợp lệ, ưu tiên giữ giá trị vừa chọn (theo thứ tự: color, ram, rom)
    // 1. Nếu vừa chọn color
    if (selectedColor != null) {
      const validOpt = option.find(opt => opt && opt.colorName === selectedColor);
      if (validOpt) {
        setSelectedRam(validOpt.ram);
        setSelectedRom(validOpt.rom);
        setSelectedOption(validOpt);
        return;
      }
    }
    // 2. Nếu vừa chọn ram
    if (selectedRam != null) {
      const validOpt = option.find(opt => opt && opt.ram === selectedRam);
      if (validOpt) {
        setSelectedColor(validOpt.colorName);
        setSelectedRom(validOpt.rom);
        setSelectedOption(validOpt);
        return;
      }
    }
    // 3. Nếu vừa chọn rom
    if (selectedRom != null) {
      const validOpt = option.find(opt => opt && opt.rom === selectedRom);
      if (validOpt) {
        setSelectedColor(validOpt.colorName);
        setSelectedRam(validOpt.ram);
        setSelectedOption(validOpt);
        return;
      }
    }
    // Nếu không có gì hợp lệ, chọn option đầu tiên
    if (option.length > 0) {
      setSelectedColor(option[0].colorName);
      setSelectedRam(option[0].ram);
      setSelectedRom(option[0].rom);
      setSelectedOption(option[0]);
    }
  }, [selectedColor, selectedRam, selectedRom, option]);

  // Helper function để lấy màu class
  const getColorClass = (color) => {
    if (!color || typeof color !== 'string') return 'bg-gray-200';
    const cleanColor = color.toLowerCase().trim();
    switch (cleanColor) {
      case 'black': return 'bg-black';
      case 'white': return 'bg-white border border-gray-300';
      case 'red': return 'bg-red-600';
      case 'blue': return 'bg-blue-600';
      case 'green': return 'bg-green-600';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-600';
      case 'pink': return 'bg-pink-500';
      case 'gray': return 'bg-gray-500';
      case 'gold': return 'bg-yellow-400';
      case 'silver': return 'bg-gray-300';
      default: return 'bg-gray-200';
    }
  };

  const front = (
    <div className="group w-[260px] h-[480px] bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-300 overflow-hidden shadow-md hover:shadow-lg transition flex flex-col">
      {/* Hình ảnh căn giữa */}
      <div className="flex justify-center items-center w-full h-[200px] mt-4 mb-2">
        <img
          className="w-[150px] h-[180px] object-cover rounded"
          src={(() => {
            if (Array.isArray(productImageResponse) && productImageResponse.length > 0) {
              const found = productImageResponse.find(img => img && (img.downloadURL || img.url || img.imageUrl));
              return found?.downloadURL || found?.url || found?.imageUrl || 'https://placehold.co/150x180';
            }
            return 'https://placehold.co/150x180';
          })()}
          alt={name || 'Product'}
          onError={(e) => {
            e.target.src = 'https://placehold.co/150x180';
          }}
        />
      </div>
      {/* Thông tin sản phẩm */}
      <div className="flex-1 flex flex-col w-full px-4 gap-2">
        <div className="text-right text-slate-500 text-xs font-medium font-['Inter'] leading-[14.40px]">{category?.name || 'Unknown category'}</div>
        <div className="text-zinc-700 text-base font-medium font-['Inter'] leading-tight truncate transition-colors duration-300 group-hover:text-blue-600 w-full">
          {name || 'No name'}
        </div>
        <div className="text-slate-500 text-xs font-medium font-['Inter'] leading-tight w-full">
          {screenDimension || 'N/A'}
          {' | '}
          {screenTech || 'N/A'}
          {' | '}
          {screenResolution || 'N/A'}
        </div>
        {/* Màu sắc, RAM, ROM */}
        <div className="flex flex-col gap-y-1 w-full">
          {/* Màu sắc */}
          {colorList.length > 0 && (
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-gray-500">Màu:</span>
              <div className="flex gap-1 flex-wrap">
                {colorList.map((color) => {
                  const faded = !isColorValid(color);
                  return (
                    <button
                      key={color}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (selectedColor === color && isColorValid(color)) return;
                        // Nếu tổ hợp hiện tại không hợp lệ, tìm option đầu tiên có color này
                        const validOpt = (option || []).find(opt => opt && opt.colorName === color);
                        if (validOpt) {
                          setSelectedColor(validOpt.colorName);
                          setSelectedRam(validOpt.ram);
                          setSelectedRom(validOpt.rom);
                        } else {
                          setSelectedColor(color);
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded border ${selectedColor === color ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'} ${faded ? 'opacity-30' : ''}`}
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
                        // Nếu tổ hợp hiện tại không hợp lệ, tìm option đầu tiên có ram này
                        const validOpt = (option || []).find(opt => opt && opt.ram === ram);
                        if (validOpt) {
                          setSelectedColor(validOpt.colorName);
                          setSelectedRam(validOpt.ram);
                          setSelectedRom(validOpt.rom);
                        } else {
                          setSelectedRam(ram);
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded border ${selectedRam === ram ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'} ${faded ? 'opacity-30' : ''}`}
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
                        // Nếu tổ hợp hiện tại không hợp lệ, tìm option đầu tiên có rom này
                        const validOpt = (option || []).find(opt => opt && opt.rom === rom);
                        if (validOpt) {
                          setSelectedColor(validOpt.colorName);
                          setSelectedRam(validOpt.ram);
                          setSelectedRom(validOpt.rom);
                        } else {
                          setSelectedRom(rom);
                        }
                      }}
                      className={`px-3 py-1 text-xs rounded border ${selectedRom === rom ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'} ${faded ? 'opacity-30' : ''}`}
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
        {/* Đã bỏ phần hiển thị selected option */}
        {/* Giá */}
        <div className="text-zinc-700 text-xl font-semibold font-['Inter'] leading-loose w-full">
          {selectedOption && selectedOption.price != null && !isNaN(selectedOption.price) ? (
            <span>{selectedOption.price.toLocaleString('vi-VN')}₫</span>
          ) : option && Array.isArray(option) && option.length > 0 ? (
            (() => {
              const validOptions = option.filter(opt => 
                opt && 
                opt.price != null && 
                !isNaN(opt.price) && 
                opt.price > 0
              );
              if (validOptions.length > 0) {
                const prices = validOptions.map(opt => opt.price);
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                return (
                  <span>Từ {minPrice.toLocaleString('vi-VN')}₫ - {maxPrice.toLocaleString('vi-VN')}₫</span>
                );
              }
              return null;
            })()
          ) : price != null && !isNaN(price) && price > 0 ? (
            <span>{price.toLocaleString('vi-VN')}₫</span>
          ) : null}
        </div>
        {/* Số phiên bản */}
        {option && Array.isArray(option) && option.length > 0 && (
          <div className="text-xs text-gray-700 font-semibold w-full">
            {option.length} phiên bản
          </div>
        )}
      </div>
    </div>
  );

  try {
    return (
      <div
        className="w-[240px] h-[480px] cursor-pointer [perspective:1200px]"
        onClick={() => navigate(`/product/${id}`)}
      >
        {front}
      </div>
    );
  } catch (error) {
    console.error('Error rendering ProductCard:', error, product);
    return (
      <div className="w-[240px] h-[480px] bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-gray-300 overflow-hidden shadow-md p-4 flex flex-col items-center justify-center">
        <div className="text-red-500 text-sm">Không thể hiển thị sản phẩm này</div>
        <div className="text-xs text-gray-500 mt-2">ID: {id || 'N/A'}, Name: {name || 'N/A'}</div>
      </div>
    );
  }
};

export default ProductCard;