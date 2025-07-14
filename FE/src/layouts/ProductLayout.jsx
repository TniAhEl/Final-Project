import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdPhoneIphone, MdBatteryFull } from "react-icons/md";
import {
  FaMicrochip,
  FaCamera,
  FaCameraRetro,
  FaTruck,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { getProductById } from "../api/productService";
import { addProductToCart } from "../api/cartService";

// Hàm decode JWT để lấy userId từ token
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
    // userId có thể là id, sub, userId tuỳ backend
    console.log(decoded);
    return decoded.userId || decoded.id || decoded.sub || null;
  } catch {
    return null;
  }
}

const ProductLayout = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedRam, setSelectedRam] = useState(null);
  const [selectedRom, setSelectedRom] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [addCartLoading, setAddCartLoading] = useState(false);

  useEffect(() => {
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
        console.log(prod);
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
        // Set store mặc định nếu có
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
  }, [id]);

  // Khi chọn màu, cập nhật lại danh sách ram/rom và selectedOption
  useEffect(() => {
    if (!product || !Array.isArray(product.option)) return;
    const optionsByColor = product.option.filter(
      (opt) => opt.colorName === selectedColor
    );
    // Lấy danh sách ram/rom duy nhất cho màu này
    const ramList = Array.from(new Set(optionsByColor.map((opt) => opt.ram)));
    const romList = Array.from(new Set(optionsByColor.map((opt) => opt.rom)));
    // Nếu selectedRam không còn hợp lệ thì chọn ram đầu tiên
    let ram = selectedRam;
    if (!ramList.includes(selectedRam)) ram = ramList[0];
    // Nếu selectedRom không còn hợp lệ thì chọn rom đầu tiên
    let rom = selectedRom;
    if (!romList.includes(selectedRom)) rom = romList[0];
    setSelectedRam(ram);
    setSelectedRom(rom);
    // Cập nhật selectedOption
    const found = optionsByColor.find(
      (opt) => opt.ram === ram && opt.rom === rom
    );
    if (found) setSelectedOption(found);
  }, [selectedColor, product]);

  // Khi chọn ram hoặc rom, cập nhật selectedOption
  useEffect(() => {
    if (!product || !Array.isArray(product.option)) return;
    // Lọc option hợp lệ với color, ram, rom
    const found = product.option.find(
      (opt) =>
        (selectedColor ? opt.colorName === selectedColor : true) &&
        (selectedRam ? opt.ram === selectedRam : true) &&
        (selectedRom ? opt.rom === selectedRom : true)
    );
    if (found) setSelectedOption(found);
  }, [selectedRam, selectedRom, selectedColor, product]);

  // Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    if (!selectedOption || !selectedOption.id) {
      alert("Vui lòng chọn phiên bản sản phẩm!");
      return;
    }
    const userId = getUserIdFromToken();
    if (!userId) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      return;
    }
    setAddCartLoading(true);
    try {
      await addProductToCart(userId, {
        productOptionId: selectedOption.id,
        quantity: 1,
      });
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      alert("Thêm vào giỏ hàng thất bại!");
    } finally {
      setAddCartLoading(false);
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

  // Lấy danh sách màu duy nhất chỉ với option còn hàng
  const colorList = Array.from(
    new Set((product.option || []).filter(opt => opt.remainingQuantity > 0).map(opt => opt.colorName))
  );
  // Lấy danh sách option hợp lệ theo từng lựa chọn
  const optionsByColor = (product.option || []).filter(
    (opt) => opt.colorName === selectedColor && opt.remainingQuantity > 0
  );
  const optionsByColorRam = optionsByColor.filter((opt) =>
    selectedRam ? opt.ram === selectedRam : true
  );
  const optionsByColorRom = optionsByColor.filter((opt) =>
    selectedRom ? opt.rom === selectedRom : true
  );

  // Danh sách RAM hợp lệ cho màu đang chọn và ROM đang chọn, chỉ lấy option còn hàng
  const ramList = Array.from(new Set(optionsByColorRom.filter(opt => opt.remainingQuantity > 0).map((opt) => opt.ram)));
  // Danh sách ROM hợp lệ cho màu đang chọn và RAM đang chọn, chỉ lấy option còn hàng
  const romList = Array.from(new Set(optionsByColorRam.filter(opt => opt.remainingQuantity > 0).map((opt) => opt.rom)));

  // Lấy tất cả giá trị RAM và ROM có trong mọi option của màu đang chọn, chỉ lấy option còn hàng
  const allRomList = Array.from(
    new Set(
      (product.option || [])
        .filter((opt) => opt.colorName === selectedColor && opt.remainingQuantity > 0)
        .map((opt) => opt.rom)
    )
  );

  // Hàm kiểm tra tổ hợp hợp lệ
  const isValidOption = (ram, rom) =>
    (product.option || []).some(
      (opt) =>
        opt.colorName === selectedColor &&
        opt.ram === ram &&
        opt.rom === rom &&
        opt.remainingQuantity > 0
    );

  // Lấy tất cả giá trị màu, RAM, ROM có trong mọi option (không lọc theo selectedColor), chỉ lấy option còn hàng
  const allColorList = Array.from(
    new Set((product.option || []).filter(opt => opt.remainingQuantity > 0).map((opt) => opt.colorName))
  );
  const allRamList = Array.from(
    new Set((product.option || []).filter(opt => opt.remainingQuantity > 0).map((opt) => opt.ram))
  );

  // Hàm kiểm tra tổ hợp hợp lệ cho từng màu/ram/rom, chỉ lấy option còn hàng
  const isValidColor = (color) =>
    (product.option || []).some(
      (opt) =>
        opt.colorName === color &&
        opt.ram === selectedRam &&
        opt.rom === selectedRom &&
        opt.remainingQuantity > 0
    );
  const isValidRam = (ram) =>
    (product.option || []).some(
      (opt) =>
        opt.colorName === selectedColor &&
        opt.ram === ram &&
        opt.rom === selectedRom &&
        opt.remainingQuantity > 0
    );
  const isValidRom = (rom) =>
    (product.option || []).some(
      (opt) =>
        opt.colorName === selectedColor &&
        opt.ram === selectedRam &&
        opt.rom === rom &&
        opt.remainingQuantity > 0
    );

  // Lấy màu class cho hiển thị
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
      {/* Hình ảnh sản phẩm và các ảnh nhỏ */}
      <div className="w-[536px] flex justify-start items-center gap-12">
        <div className="inline-flex flex-col justify-start items-center gap-6">
          <img
            className="w-[74.88px] h-[93px]"
            src={
              product.productImageResponse?.[0]?.url ||
              "https://placehold.co/75x93"
            }
            alt="thumb1"
          />
          <img
            className="w-[46.31px] h-[93px] opacity-40"
            src={
              product.productImageResponse?.[1]?.url ||
              "https://placehold.co/46x93"
            }
            alt="thumb2"
          />
          <img
            className="w-[45.32px] h-[93px] opacity-40"
            src={
              product.productImageResponse?.[2]?.url ||
              "https://placehold.co/45x93"
            }
            alt="thumb3"
          />
          <img
            className="w-[34.49px] h-[93px] opacity-40"
            src={
              product.productImageResponse?.[3]?.url ||
              "https://placehold.co/34x93"
            }
            alt="thumb4"
          />
        </div>
        <img
          className="w-[413.12px] h-[516px]"
          src={
            product.productImageResponse?.[0]?.url ||
            "https://placehold.co/413x516"
          }
          alt="main"
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
        {/* Tên và giá */}
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
          {/* Chọn màu */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch inline-flex justify-start items-center gap-4">
              <div className="justify-center text-neutral-950 text-[15px] font-normal font-['Inter'] leading-normal">
                Select color :
              </div>
              <div className="flex-1 self-stretch pr-[246px] flex justify-start items-center gap-2">
                {allColorList.length > 0 ? (
                  allColorList.map((color, idx) => {
                    const disabled = !isValidColor(color);
                    return (
                      <button
                        key={color}
                        className={`flex items-center gap-2 px-3 py-1 text-sm rounded-full border ${
                          selectedColor === color
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 bg-white"
                        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
                        onClick={() => setSelectedColor(color)}
                        disabled={disabled}
                      >
                        <div
                          className={`w-4 h-4 rounded-full ${colorClass(
                            color
                          )}`}
                        />
                        <span className="text-neutral-500 text-sm font-normal font-['Inter'] leading-normal">
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
            {/* Chọn RAM và ROM trên cùng một hàng */}
            <div className="self-stretch flex flex-row gap-8">
              {/* RAM */}
              <div className="flex flex-col gap-1">
                <div className="text-xs text-gray-500 mb-1 ml-1">
                  Choose the RAM capacity that fits your needs
                </div>
                <div className="inline-flex justify-start items-center gap-2">
                  {allRamList.map((ram, idx) => {
                    const disabled = !isValidRam(ram);
                    return (
                      <button
                        key={ram}
                        className={`px-4 py-2 text-base rounded-lg border ${
                          selectedRam === ram
                            ? "border-blue-500 bg-blue-50 text-blue-600 font-bold"
                            : "border-gray-300 bg-white text-gray-700"
                        } flex justify-center items-center gap-2 text-xs ${
                          disabled ? "opacity-50 pointer-events-none" : ""
                        }`}
                        onClick={() => setSelectedRam(ram)}
                        disabled={disabled}
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
                    const disabled = !isValidRom(rom);
                    return (
                      <button
                        key={rom}
                        className={`px-4 py-2 text-base rounded-lg border ${
                          selectedRom === rom
                            ? "border-blue-500 bg-blue-50 text-blue-600 font-bold"
                            : "border-gray-300 bg-white text-gray-700"
                        } flex justify-center items-center gap-2 text-xs ${
                          disabled ? "opacity-50 pointer-events-none" : ""
                        }`}
                        onClick={() => setSelectedRom(rom)}
                        disabled={disabled}
                      >
                        {rom}GB
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Thông số nhanh */}
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
              {/* Ram và Rom */}
            </div>
            {/* Mô tả ngắn */}
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
                  onChange={e => {
                    const store = product.stores.find(s => s.id === Number(e.target.value));
                    setSelectedStore(store);
                  }}
                  className="border rounded px-2 py-1"
                >
                  {product.stores.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name}{store.location ? ` - ${store.location}` : ""}
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
            {/* Nút wishlist và add to cart */}
            <div className="self-stretch inline-flex justify-start items-start gap-4 flex-wrap content-start">
              <div className="flex-1 min-w-[136px] px-14 py-4 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-black flex justify-center items-center gap-2">
                <div className="text-center justify-start text-black text-base font-medium font-['Inter'] leading-normal">
                  Pre Order NOW
                </div>
              </div>
              <div className="flex-1 min-w-[136px] px-14 py-4 bg-black rounded-md flex justify-center items-center gap-2">
                <button
                  className="text-center justify-start text-white text-base font-medium font-['Inter'] leading-normal w-full bg-black  transition rounded-md disabled:opacity-60"
                  onClick={handleAddToCart}
                  disabled={addCartLoading}
                >
                  {addCartLoading ? "Đang thêm..." : "Add to Cart"}
                </button>
              </div>
            </div>
            {/* Thông tin giao hàng, bảo hành */}
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
              {/* In Stock */}
              <div className="flex-1 rounded-lg flex justify-start items-center gap-4">
                <div className="p-4 bg-neutral-100 rounded-[11px] flex justify-center items-center">
                  <FaCheckCircle className="text-2xl text-green-600" />
                </div>
                <div className="justify-start">
                  <span className="text-neutral-500 text-sm font-medium font-['Inter'] leading-normal">
                    In Stock
                    <br />
                  </span>
                  <span className="text-black text-sm font-medium font-['Inter'] leading-normal">
                    Today{" "}
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
                      ? `${product.warranty.duration} year`
                      : "1 year"}
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
