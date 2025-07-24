import React, { useState, useRef, useEffect } from "react";
import HeaderAuth from "../../components/Header/HeaderAuth";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/Card/Product";
import SubmitButton from "../../components/Button/Submit";
import DeleteButton from "../../components/Button/Delete";
import { FaShoppingCart } from "react-icons/fa";
import { getCartByUserId } from "../../api/cartService";
import { getInformation } from "../../api/authService";
import { getAllPromotion, placeOrder } from "../../api/orderService";
import { updateProductQuantity } from "../../api/cartService";
import { deleteCartProduct } from "../../api/cartService";
import { useNavigate } from "react-router-dom";
import OrderProductCard from "../../components/Card/OrderProductCard";
import { getAllInsurances } from "../../api/insuranceService";

const paymentMethods = [
  { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
  { value: "bank", label: "Chuyển khoản ngân hàng" },
  { value: "momo", label: "Ví MoMo" },
];

const shippingMethods = [
  { value: "FAST", label: "Giao hàng nhanh (FAST)" },
  { value: "STANDARD", label: "Giao hàng tiêu chuẩn (STANDARD)" },
  { value: "EXPRESS", label: "Giao hàng hỏa tốc (EXPRESS)" },
  { value: "PICKUP", label: "Nhận tại cửa hàng (PICKUP)" },
];

const orderTypes = [
  { value: "DELIVERY", label: "Giao tận nơi (DELIVERY)" },
  { value: "PICKUP", label: "Nhận tại cửa hàng (PICKUP)" },
];

const Checkout = () => {
  // Danh sách mã giảm giá lấy từ API
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [products, setProducts] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isChoosing, setIsChoosing] = useState(false); // true: đang chọn từ danh sách, false: đang nhập
  const [payment, setPayment] = useState(paymentMethods[0].value);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();
  // Loading tổng cho trang
  const [pageLoading, setPageLoading] = useState(true);
  // Trạng thái loading và thông báo cho cập nhật số lượng từng sản phẩm
  const [updatingId, setUpdatingId] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [updateError, setUpdateError] = useState("");
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState(orderTypes[0].value);
  const [shippingMethod, setShippingMethod] = useState(
    shippingMethods[0].value
  );
  const [insurances, setInsurances] = useState([]);
  const [selectedInsurances, setSelectedInsurances] = useState({}); // { [productId]: { insuranceId, quantity } }

  // Lấy danh sách bảo hiểm khi vào trang
  useEffect(() => {
    getAllInsurances().then((res) => setInsurances(res.data || []));
  }, []);

  // Lấy cart thực tế từ API khi vào trang
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Bạn chưa đăng nhập.");
      setPageLoading(false);
      return;
    }
    let infoDone = false,
      cartDone = false,
      promoDone = false;
    const checkDone = () => {
      if (infoDone && cartDone && promoDone) setPageLoading(false);
    };
    // Lấy thông tin user
    getInformation(userId)
      .then((res) => {
        setCustomer((prev) => ({
          ...prev,
          name:
            ((res.lastName || "") + " " + (res.firstName || "")).trim() ||
            prev.name ||
            "",
          phone: res.phone || prev.phone || "",
          email: res.email || prev.email || "",
          address: res.address || prev.address || "",
        }));
        infoDone = true;
        checkDone();
      })
      .catch(() => {
        infoDone = true;
        checkDone();
      });
    getCartByUserId(userId)
      .then((res) => {
        const cart = res.data;
        setProducts(
          cart.cartProducts?.map((p) => ({
            id: p.productOption.id,
            name: p.productOption.productName,
            quantity: p.quantity,
            option: {
              colorName: p.productOption.colorName,
              ram: p.productOption.ram,
              rom: p.productOption.rom,
            },
            price: p.productOption.price,
          })) || []
        );
        cartDone = true;
        checkDone();
      })
      .catch(() => {
        setError("Không thể tải giỏ hàng.");
        cartDone = true;
        checkDone();
      });
    // Lấy danh sách mã giảm giá
    getAllPromotion()
      .then((res) => {
        const data = res.data || [];
        setAvailableDiscounts(
          data.map((d) => ({
            code: d.code,
            label: `${d.code} - ${d.name}`,
            remain: d.quantity,
            value:
              d.type === "PERCENTAGE"
                ? `${d.value}%`
                : d.value.toLocaleString("vi-VN") + "₫",
            expiry: d.endDate,
            description: d.description,
          }))
        );
        promoDone = true;
        checkDone();
      })
      .catch(() => {
        setAvailableDiscounts([]);
        promoDone = true;
        checkDone();
      });
  }, []);

  // Xử lý xóa sản phẩm khỏi đơn hàng
  const handleRemoveProduct = (id) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    deleteCartProduct(userId, id)
      .then(() => getCartByUserId(userId))
      .then((res) => {
        const cart = res.data;
        setProducts(
          cart.cartProducts?.map((p) => ({
            id: p.productOption.id,
            name: p.productOption.productName,
            quantity: p.quantity,
            option: {
              colorName: p.productOption.colorName,
              ram: p.productOption.ram,
              rom: p.productOption.rom,
            },
            price: p.productOption.price,
          })) || []
        );
      })
      .catch(() => setError("Không thể xóa sản phẩm khỏi giỏ hàng."));
  };

  // Debounce map cho từng sản phẩm
  const debounceTimers = useRef({});
  // Xử lý tăng/giảm số lượng sản phẩm
  const handleChangeQuantity = (id, delta) => {
    setUpdatingId(id);
    const userId = localStorage.getItem("userId");
    const product = products.find((p) => p.id === id);
    if (!userId || !product) return;
    const prevQuantity = product.quantity;
    const newQuantity = Math.max(1, product.quantity + delta);
    // Xoá timer cũ nếu có
    if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id]);
    // Cập nhật UI ngay
    setProducts((products) =>
      products.map((p) => (p.id === id ? { ...p, quantity: newQuantity } : p))
    );
    // Đặt timer mới
    debounceTimers.current[id] = setTimeout(() => {
      updateProductQuantity(userId, {
        productOptionId: id,
        quantity: newQuantity,
      })
        .then(() => getCartByUserId(userId))
        .then((res) => {
          const cart = res.data;
          setProducts(
            cart.cartProducts?.map((p) => ({
              id: p.productOption.id,
              name: p.productOption.productName,
              quantity: p.quantity,
              option: {
                colorName: p.productOption.colorName,
                ram: p.productOption.ram,
                rom: p.productOption.rom,
              },
              price: p.productOption.price,
            })) || []
          );
          setUpdateMessage("Cập nhật số lượng thành công!");
          setTimeout(() => setUpdateMessage(""), 2000);
          setUpdatingId(null);
        })
        .catch((e) => {
          setUpdateError("Số lượng sản phẩm trong kho không đủ.");
          setProducts((products) =>
            products.map((p) =>
              p.id === id ? { ...p, quantity: prevQuantity } : p
            )
          );
          setTimeout(() => setUpdateError(""), 2000);
          setUpdatingId(null);
        });
    }, 200);
  };

  // Khi nhập tay
  const handleInputDiscount = (e) => {
    setDiscountCode(e.target.value);
    setSelectedDiscount(null);
    setIsChoosing(false);
  };
  // Khi chọn từ danh sách
  const handleSelectDiscount = (d) => {
    setSelectedDiscount(d.code);
    setDiscountCode("");
    setIsChoosing(false); // Đóng dropdown sau khi chọn
  };
  // Khi click vào input nhập mã
  const handleFocusInput = () => {
    setIsChoosing(false);
  };
  // Khi click vào nút mở danh sách
  const handleOpenList = () => {
    setIsChoosing(true);
    setDiscountCode("");
  };
  // Lọc danh sách mã giảm giá theo input (chỉ dùng cho input, không filter khi chọn)
  const filteredDiscounts = availableDiscounts.filter(
    (d) =>
      d.code.toLowerCase().includes(discountCode.toLowerCase()) ||
      d.label.toLowerCase().includes(discountCode.toLowerCase())
  );
  // Lấy info mã giảm giá
  const info = availableDiscounts.find(
    (d) => d.code === (isChoosing ? selectedDiscount : discountCode)
  );

  // Callback khi chọn bảo hiểm cho từng sản phẩm
  // Sửa lại callback để nhận object { insuranceId, productOptionId, quantity }
  const handleSelectInsurance = ({ insuranceId, productOptionId, quantity }) => {
    setSelectedInsurances((prev) => ({
      ...prev,
      [productOptionId]: { insuranceId, quantity },
    }));
  };

  // Xử lý đặt hàng
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Bạn chưa đăng nhập.");
      setLoading(false);
      return;
    }
    try {
      const promotionCode = selectedDiscount || discountCode || undefined;
      // Chuẩn bị orderInfo và insuranceContracts
      const orderInfo = {
        type: orderType,
        address: customer.address,
        note,
        method: shippingMethod,
      };
      // Build insuranceContracts từ selectedInsurances
      const insuranceContracts = Object.entries(selectedInsurances).map(
        ([productOptionId, v]) => ({
          insuranceId: v.insuranceId,
          productOptionId: Number(productOptionId),
          quantity: v.quantity,
        })
      );
      // Gọi API với đúng tham số
      const logBody = {
        userId,
        promotionCode,
        orderInfo,
        insuranceContracts,
      };
      console.log("Order body gửi đi:", JSON.stringify(logBody, null, 2));
      const res = await placeOrder({
        userId,
        promotionCode,
        orderInfo,
        insuranceContracts,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate("/customer/orders");
      }, 1200);
    } catch (err) {
      setError("Đặt hàng thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></span>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <HeaderAuth />
      <form
        className="flex-1 max-w-6xl mx-auto py-12 px-6"
        onSubmit={handleSubmit}
      >
        <div className="border rounded-xl shadow-lg bg-white p-6 md:p-10 flex flex-col md:flex-row gap-8">
          {/* Cột trái: Thông tin người đặt + sản phẩm */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Thông tin người đặt */}
            <div className="bg-white rounded shadow p-8 mb-0">
              <h2 className="text-lg font-semibold mb-4 text-blue-900">
                Thông tin người đặt
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                    value={customer.name}
                    readOnly
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                    value={customer.phone}
                    readOnly
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                    value={customer.email}
                    readOnly
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ nhận hàng
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={customer.address}
                    onChange={(e) =>
                      setCustomer({ ...customer, address: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>
            {/* Thông tin đơn hàng */}
            <div className="bg-white rounded shadow p-4 mb-0">
              <h2 className="text-lg font-semibold mb-4 text-blue-900">
                Thông tin đơn hàng
              </h2>
              <div className="flex flex-col gap-4">
                {products.map((p) => (
                  <OrderProductCard
                    key={p.id}
                    product={p}
                    onChangeQuantity={handleChangeQuantity}
                    onRemove={handleRemoveProduct}
                    updatingId={updatingId}
                    insurances={insurances}
                    onSelectInsurance={handleSelectInsurance}
                    selectedInsurance={selectedInsurances[p.id]}
                  />
                ))}
                {/* Thông báo cập nhật số lượng */}
                {updateMessage && (
                  <div className="text-green-600 text-sm mt-2">
                    {updateMessage}
                  </div>
                )}
                {updateError && (
                  <div className="text-red-600 text-sm mt-2">{updateError}</div>
                )}
              </div>
            </div>
          </div>
          {/* Cột phải: Mã giảm giá, thanh toán, ghi chú, tổng tiền, nút chức năng */}
          <div className="w-full md:w-[380px] flex flex-col gap-4">
            {/* Mã giảm giá */}
            <div className="bg-white rounded shadow p-8 mb-0 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã giảm giá
              </label>
              <div className="flex flex-col md:flex-row gap-2 items-stretch">
                {/* Ô nhập mã */}
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={discountCode}
                  onChange={handleInputDiscount}
                  onFocus={handleFocusInput}
                  placeholder="Nhập mã..."
                  autoComplete="off"
                  disabled={isChoosing}
                />
                {/* Ô chọn từ danh sách */}
                <div className="relative w-full md:w-1/2">
                  <button
                    type="button"
                    className={`w-full border rounded px-3 py-2 text-left bg-white ${
                      isChoosing ? "ring-2 ring-blue-400" : ""
                    }`}
                    onClick={handleOpenList}
                    disabled={discountCode.length > 0}
                  >
                    {selectedDiscount ? (
                      <span className="font-semibold text-blue-700">
                        {selectedDiscount}
                      </span>
                    ) : (
                      "Chọn mã giảm giá"
                    )}
                  </button>
                  {/* Dropdown danh sách mã giảm giá */}
                  {isChoosing && (
                    <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded shadow-lg z-10 max-h-56 overflow-auto">
                      {availableDiscounts.map((d) => (
                        <div
                          key={d.code}
                          className="px-4 py-2 cursor-pointer hover:bg-blue-50 flex flex-col gap-0.5"
                          onMouseDown={() => handleSelectDiscount(d)}
                        >
                          <div className="font-semibold text-blue-700">
                            {d.code}
                          </div>
                          <div className="text-xs text-gray-600 flex flex-wrap gap-2">
                            <span>
                              Giá trị:{" "}
                              <span className="font-semibold">{d.value}</span>
                            </span>
                            <span>
                              Hạn dùng:{" "}
                              <span className="font-semibold">{d.expiry}</span>
                            </span>
                            <span>
                              Số lượng còn lại:{" "}
                              <span className="font-semibold">{d.remain}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Hiển thị info mã đã chọn hoặc nhập */}
              {info && (
                <div className="text-green-600 text-sm ">
                  Đã chọn mã: <span className="font-semibold">{info.code}</span>
                  <div className="text-gray-700 text-xs pl-2">
                    <div>
                      Số lượng còn lại:{" "}
                      <span className="font-semibold">{info.remain}</span>
                    </div>
                    <div>
                      Giá trị:{" "}
                      <span className="font-semibold">{info.value}</span>
                    </div>
                    <div>
                      Hạn dùng:{" "}
                      <span className="font-semibold">{info.expiry}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Phương thức thanh toán */}
            <div className="bg-white rounded shadow p-4 mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phương thức thanh toán
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                {paymentMethods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Loại đơn hàng */}
            <div className="bg-white rounded shadow p-4 mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại đơn hàng
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
              >
                {orderTypes.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Phương thức vận chuyển */}
            <div className="bg-white rounded shadow p-4 mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phương thức vận chuyển
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
              >
                {shippingMethods.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Ghi chú */}
            <div className="bg-white rounded shadow p-4 mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú cho đơn hàng
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[60px]"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú nếu có..."
              />
            </div>
            {/* Tổng tiền & nút chức năng */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 ">
              <div className="text-xl font-bold text-blue-900">
                Tổng tiền:{" "}
                {products
                  .reduce((sum, p) => sum + p.price * p.quantity, 0)
                  .toLocaleString("vi-VN")}
                ₫
              </div>
              <div className="flex gap-2">
                <SubmitButton
                  type="submit"
                  disabled={loading || products.length === 0}
                >
                  <span className="flex items-center gap-2">
                    <FaShoppingCart className="text-lg" />
                    {loading ? "Đang đặt hàng..." : "Đặt hàng"}
                  </span>
                </SubmitButton>
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={() => window.location.reload()}
                >
                  Làm mới
                </button>
              </div>
            </div>
            {success && (
              <div className="text-green-600 font-semibold ">
                Đặt hàng thành công!
              </div>
            )}
            {error && (
              <div className="text-red-600 font-semibold ">{error}</div>
            )}
          </div>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default Checkout;
