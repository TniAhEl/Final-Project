import React, { useState, useRef, useEffect } from "react";
import HeaderAuth from "../../components/Header/HeaderAuth";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/Card/Product";
import SubmitButton from "../../components/Button/Submit";
import DeleteButton from "../../components/Button/Delete";
import CompareSidebar from "../../components/Sidebar/Compare";
import { FaShoppingCart } from "react-icons/fa";
import { getCartByUserId } from "../../api/cartService";
import { getInformation, getCustomerReceivers, addCustomerReceiver, updateCustomerReceiver } from "../../api/authService";
import { getAllPromotion, placeOrder, placeGuestOrder } from "../../api/orderService";
import { updateProductQuantity } from "../../api/cartService";
import { deleteCartProduct } from "../../api/cartService";
import { useNavigate } from "react-router-dom";
import OrderProductCard from "../../components/Card/OrderProductCard";
import { getAllInsurances } from "../../api/insuranceService";
import { getGuestProducts } from "../../api/productService";
import { 
  getLocalCart, 
  getLocalCartTotal, 
  updateLocalCartQuantity, 
  removeFromLocalCart, 
  clearLocalCart,
  isAuthenticated 
} from "../../services/localCartService";

const paymentMethods = [
  { value: "cod", label: "Cash On Delivery (COD)" },
  { value: "bank", label: "Bank Transfer" },
  { value: "momo", label: "MoMo Wallet" },
];

const shippingMethods = [
  { value: "FAST", label: "Fast Shipping (FAST)" },
  { value: "STANDARD", label: "Standard Shipping (STANDARD)" },
  { value: "EXPRESS", label: "Express Shipping (EXPRESS)" },
  { value: "PICKUP", label: "In-Store Pickup (PICKUP)" },
];

const orderTypes = [
  { value: "DELIVERY", label: "Delivery (DELIVERY)" },
  { value: "PICKUP", label: "In-Store Pickup (PICKUP)" },
];

const Checkout = () => {
  // List of available discounts
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
  const [isChoosing, setIsChoosing] = useState(false); // true:from dropdown, false: from input
  const [payment, setPayment] = useState(paymentMethods[0].value);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef();
  // Loading total
  const [pageLoading, setPageLoading] = useState(true);
  
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

  // Receiver information
  const [receiverInfo, setReceiverInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [showReceiverModal, setShowReceiverModal] = useState(false);
  const [savedReceivers, setSavedReceivers] = useState([]); // List of saved receiver information
  const [serverReceivers, setServerReceivers] = useState([]); // List of receiver information from server
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingReceiver, setEditingReceiver] = useState(null);

  // Product details information for guest cart
  const [guestProductDetails, setGuestProductDetails] = useState({}); // { productOptionId: productDetail }

  // Get all insurance options
  useEffect(() => {
    getAllInsurances().then((res) => setInsurances(res.data || []));
  }, []);

  // Get actual cart from API or localStorage when entering the page
  useEffect(() => {
    // Get list of promotions for all users
    getAllPromotion()
      .then((res) => {
        console.log("Promotions loaded:", res.data);
        setAvailableDiscounts(res.data || []);
      })
      .catch((error) => {
        console.error("Error fetching promotions:", error);
        setAvailableDiscounts([]);
      });

    if (isAuthenticated()) {
      // User is logged in - fetch from server
      const userId = localStorage.getItem("userId");
      let infoDone = false,
        cartDone = false;
      const checkDone = () => {
        if (infoDone && cartDone) setPageLoading(false);
      };
      // Get user information
      getInformation(userId)
        .then((res) => {
          const userInfo = {
            name:
              ((res.lastName || "") + " " + (res.firstName || "")).trim() ||
              "",
            phone: res.phone || "",
            email: res.email || "",
            address: res.address || "",
          };
          setCustomer(userInfo);
          // Initialize receiverInfo with user information
          setReceiverInfo(userInfo);
          infoDone = true;
          checkDone();
        })
        .catch(() => {
          infoDone = true;
          checkDone();
        });

      // Get cart from server
      getCartByUserId(userId)
        .then((res) => {
          const cart = res.data;
          setProducts(cart.cartProducts || []);
          cartDone = true;
          checkDone();
        })
        .catch(() => {
          setError("cannot load cart.");
          cartDone = true;
          checkDone();
        });
    } else {
      // User is not logged in - use local cart
      const localCart = getLocalCart();
      if (localCart.length === 0) {
        setError("Your cart is empty. Please add products to the cart.");
        setPageLoading(false);
        return;
      }
      
      // Prepare data for API call
      const productsForApi = localCart.map(item => ({
        productOptionId: item.productOptionId,
        quantity: item.quantity
      }));
      
      // Get detailed product information from API
      getGuestProducts(productsForApi)
        .then((productDetails) => {
          // Create a map for quick lookup
          const productDetailsMap = {};
          productDetails.forEach(product => {
            productDetailsMap[product.id] = product;
          });
          setGuestProductDetails(productDetailsMap);
          
          // Convert local cart to server cart format with detailed info
          const convertedProducts = localCart.map(item => {
            const detail = productDetailsMap[item.productOptionId];
            return {
              id: item.productOptionId,
              quantity: item.quantity,
              productOption: {
                id: item.productOptionId,
                productName: detail ? detail.name : item.name,
                price: detail ? detail.price : item.price,
                image: item.image
              },
              availableQuantity: detail ? detail.availableQuantity : 0
            };
          });
          
          setProducts(convertedProducts);
          setPageLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching guest product details:", error);
          setError("Cannot load product information.");
          setPageLoading(false);
        });
    }
  }, []);

  // Handle removing product from order
  const handleRemoveProduct = (id) => {
    if (isAuthenticated()) {
      // User is logged in - remove from server cart
      const userId = localStorage.getItem("userId");
      deleteCartProduct(userId, id)
        .then(() => getCartByUserId(userId))
        .then((res) => {
          const cart = res.data;
          setProducts(cart.cartProducts || []);
        })
        .catch(() => setError("Cannot remove product from cart."));
    } else {
      // User is not logged in - remove from local cart
      removeFromLocalCart(id);
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
    }
  };

  // Debounce map for each product
  const debounceTimers = useRef({});
  // Handle changing product quantity
  const handleChangeQuantity = (id, delta) => {
    setUpdatingId(id);
    const product = products.find((p) => p.id === id);
    if (!product) return;
    
    const prevQuantity = product.quantity;
    const newQuantity = Math.max(1, product.quantity + delta);

    // Check availableQuantity for guest cart
    if (!isAuthenticated() && product.availableQuantity !== undefined) {
      if (newQuantity > product.availableQuantity) {
        setUpdateError(`Chỉ còn ${product.availableQuantity} sản phẩm trong kho.`);
        setTimeout(() => setUpdateError(""), 2000);
        setUpdatingId(null);
        return;
      }
    }

    // Update UI immediately
    setProducts((products) =>
      products.map((p) => (p.id === id ? { ...p, quantity: newQuantity } : p))
    );
    
    if (isAuthenticated()) {
      // User is logged in - update server cart
      const userId = localStorage.getItem("userId");
      // Clear old timer if exists
      if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id]);
      // Set new timer
      debounceTimers.current[id] = setTimeout(() => {
        updateProductQuantity(userId, {
          productOptionId: id,
          quantity: newQuantity,
        })
          .then(() => getCartByUserId(userId))
          .then((res) => {
            const cart = res.data;
            setProducts(cart.cartProducts || []);
            setUpdateMessage("Update quantity successfully!");
            setTimeout(() => setUpdateMessage(""), 2000);
            setUpdatingId(null);
          })
          .catch((e) => {
            setUpdateError("Insufficient product quantity in stock.");
            setProducts((products) =>
              products.map((p) =>
                p.id === id ? { ...p, quantity: prevQuantity } : p
              )
            );
            setTimeout(() => setUpdateError(""), 2000);
            setUpdatingId(null);
          });
      }, 200);
    } else {
      // User is not logged in - update local cart
      updateLocalCartQuantity(id, newQuantity);
      setUpdateMessage("Update quantity successfully!");
      setTimeout(() => setUpdateMessage(""), 2000);
      setUpdatingId(null);
    }
  };


  const handleInputDiscount = (e) => {
    console.log("Input discount:", e.target.value);
    setDiscountCode(e.target.value);
    setSelectedDiscount(null);
    setIsChoosing(false);
  };
  const handleSelectDiscount = (d) => {
    console.log("Selected discount:", d);
    setSelectedDiscount(d.code);
    setDiscountCode("");
    setIsChoosing(false); // Close dropdown after selection
  };
  // When clicking on the input to enter the code
  const handleFocusInput = () => {
    console.log("Focus input");
    setIsChoosing(false);
  };
  // When clicking on the button to open the list
  const handleOpenList = () => {
    console.log("Open list, available discounts:", availableDiscounts);
    setIsChoosing(!isChoosing); // Toggle dropdown
    if (!isChoosing) {
      setDiscountCode(""); // Clear input when opening dropdown
    }
  };
  // Filter discount codes based on input (only for input, no filter when selecting)
  const filteredDiscounts = availableDiscounts.filter(
    (d) =>
      d.code.toLowerCase().includes(discountCode.toLowerCase()) ||
      d.label.toLowerCase().includes(discountCode.toLowerCase())
  );
  // Get info about the discount code
  const info = availableDiscounts.find(
    (d) => d.code === (isChoosing ? selectedDiscount : discountCode)
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isChoosing && !event.target.closest('.discount-dropdown')) {
        setIsChoosing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChoosing]);

  // Callback when selecting insurance for each product
  // Update callback to receive object { insuranceId, productOptionId, quantity }
  const handleSelectInsurance = ({ insuranceId, productOptionId, quantity }) => {
    setSelectedInsurances((prev) => ({
      ...prev,
      [productOptionId]: { insuranceId, quantity },
    }));
  };

  // Handle receiver information
  const handleOpenReceiverModal = () => {
    setShowReceiverModal(true);
    setIsAddingNew(false);
    setEditingReceiver(null);

    // If user is logged in, fetch receiver information from server
    if (isAuthenticated()) {
      const userId = localStorage.getItem("userId");
      getCustomerReceivers(userId)
        .then((receivers) => {
          setServerReceivers(receivers || []);
        })
        .catch((error) => {
          console.error("Error fetching receiver information:", error);
          setServerReceivers([]);
        });
    }
  };

  const handleCloseReceiverModal = () => {
    setShowReceiverModal(false);
    setIsAddingNew(false);
    setEditingReceiver(null);
  };

  const handleSelectReceiver = (receiver) => {
    setReceiverInfo(receiver);
    setShowReceiverModal(false);
  };

  const handleAddNewReceiver = () => {
    setIsAddingNew(true);
    setEditingReceiver({
      name: "",
      phone: "",
      email: "",
      address: "",
    });
  };

  const handleSaveReceiver = async () => {
    if (!editingReceiver.name || !editingReceiver.phone || !editingReceiver.address) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc (tên, số điện thoại, địa chỉ)");
      return;
    }

    if (isAuthenticated()) {
      // Người dùng đã đăng nhập - gọi API
      const userId = localStorage.getItem("userId");
      try {
        if (isAddingNew) {
          // Thêm mới
          await addCustomerReceiver(userId, editingReceiver);
          // Refresh danh sách từ server
          const receivers = await getCustomerReceivers(userId);
          setServerReceivers(receivers || []);
          // Chọn thông tin vừa thêm
          setReceiverInfo(editingReceiver);
        } else {
          // Cập nhật
          await updateCustomerReceiver(editingReceiver.id, editingReceiver);
          // Refresh danh sách từ server
          const receivers = await getCustomerReceivers(userId);
          setServerReceivers(receivers || []);
          // Cập nhật thông tin hiện tại nếu đang chọn
          if (receiverInfo.id === editingReceiver.id) {
            setReceiverInfo(editingReceiver);
          }
        }
      } catch (error) {
        console.error("Error saving receiver:", error);
        alert("Có lỗi xảy ra khi lưu thông tin người nhận.");
        return;
      }
    } else {
      // Người dùng chưa đăng nhập - lưu local
      if (isAddingNew) {
        // Thêm mới
        const newReceiver = {
          id: Date.now(),
          ...editingReceiver,
        };
        setSavedReceivers([...savedReceivers, newReceiver]);
        setReceiverInfo(newReceiver);
      } else {
        // Cập nhật
        const updatedReceivers = savedReceivers.map(r => 
          r.id === editingReceiver.id ? editingReceiver : r
        );
        setSavedReceivers(updatedReceivers);
        setReceiverInfo(editingReceiver);
      }
    }
    
    setShowReceiverModal(false);
    setIsAddingNew(false);
    setEditingReceiver(null);
  };

  const handleEditReceiver = (receiver) => {
    setEditingReceiver(receiver);
    setIsAddingNew(false);
  };

  const handleDeleteReceiver = (receiverId) => {
    const updatedReceivers = savedReceivers.filter(r => r.id !== receiverId);
    setSavedReceivers(updatedReceivers);
    
    // Nếu đang chọn receiver bị xóa, chuyển về thông tin user
    if (receiverInfo.id === receiverId) {
      setReceiverInfo({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
      });
    }
  };

  // Xử lý đặt hàng
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      const promotionCode = selectedDiscount || discountCode || undefined;
      
      if (isAuthenticated()) {
        // Người dùng đã đăng nhập
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("Bạn chưa đăng nhập.");
          setLoading(false);
          return;
        }
        
        // Chuẩn bị orderInfo và insuranceContracts
        const orderInfo = {
          type: orderType,
          address: receiverInfo.address,
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
      } else {
        // Người dùng chưa đăng nhập - sử dụng guest order API
        // Chuẩn bị orderInfo với thông tin người nhận
        const orderInfo = {
          name: receiverInfo.name,
          address: receiverInfo.address,
          phone: receiverInfo.phone,
          email: receiverInfo.email,
          note,
          type: orderType,
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
        
        // Build productList từ local cart
        const productList = {
          items: products.map(product => ({
            productOptionId: product.id,
            quantity: product.quantity
          }))
        };
        
        // Gọi API guest order
        const logBody = {
          promotionCode,
          orderInfo,
          insuranceContracts,
          productList,
        };
        console.log("Guest order body gửi đi:", JSON.stringify(logBody, null, 2));
        const res = await placeGuestOrder({
          promotionCode,
          orderInfo,
          insuranceContracts,
          productList,
        });
        
        setSuccess(true);
        // Xóa local cart sau khi đặt hàng thành công
        clearLocalCart();
        if (res.data && res.data.data) {
          // Có thể lưu thông tin đơn hàng vào localStorage để hiển thị sau
          localStorage.setItem('lastGuestOrder', JSON.stringify(res.data.data));
        }
        setTimeout(() => {
          navigate("/"); // Chuyển về trang chủ thay vì /customer/orders
        }, 1200);
      }
    } catch (err) {
      console.error("Order error:", err);
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
  // Tính tổng phí bảo hiểm đã chọn
  const totalInsuranceFee = products.reduce((sum, p) => {
    const ins = selectedInsurances[p.id];
    if (!ins) return sum;
    const insurance = insurances.find((i) => i.id === ins.insuranceId);
    if (!insurance) return sum;
    return sum + (insurance.fee || 0) * (ins.quantity || 1);
  }, 0);

  // Tính tổng tiền sản phẩm
  const totalProduct = products.reduce((sum, p) => {
    // Với người dùng đã đăng nhập: p.price
    // Với người dùng chưa đăng nhập: p.productOption.price
    const price = p.productOption?.price || p.price || 0;
    return sum + price * p.quantity;
  }, 0);

  // Tính giảm giá
  let discountValue = 0;
  const discountObj = availableDiscounts.find(
    (d) => d.code === (selectedDiscount || discountCode)
  );
  if (discountObj && discountObj.value) {
    const valueStr = String(discountObj.value); // Convert to string safely
    if (valueStr.endsWith("%")) {
      // Phần trăm
      const percent = parseFloat(valueStr);
      discountValue = Math.round(((totalProduct + totalInsuranceFee) * percent) / 100);
    } else {
      // Số tiền
      discountValue = parseInt(valueStr.replace(/[^\d]/g, ""), 10) || 0;
    }
  }

  // Tổng tiền cuối cùng
  const totalFinal = Math.max(0, totalProduct + totalInsuranceFee - discountValue);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isAuthenticated() ? <HeaderAuth /> : <Header />}
      <form
        className="flex-1 max-w-6xl mx-auto py-12 px-6"
        onSubmit={handleSubmit}
      >
        <div className="border rounded-xl shadow-lg bg-white p-6 md:p-10 flex flex-col md:flex-row gap-8">
          {/* Cột trái: Thông tin người đặt + sản phẩm */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Thông tin người nhận */}
            <div className="bg-white rounded shadow p-8 mb-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-blue-900">
                  Receiver Information
                </h2>
                {isAuthenticated() && (
                  <button
                    type="button"
                    onClick={handleOpenReceiverModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                  >
                    Change Receiver
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 ${isAuthenticated() ? 'bg-gray-100' : ''}`}
                    value={receiverInfo.name}
                    onChange={!isAuthenticated() ? (e) => setReceiverInfo({...receiverInfo, name: e.target.value}) : undefined}
                    readOnly={isAuthenticated()}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className={`w-full border rounded px-3 py-2 ${isAuthenticated() ? 'bg-gray-100' : ''}`}
                    value={receiverInfo.phone}
                    onChange={!isAuthenticated() ? (e) => setReceiverInfo({...receiverInfo, phone: e.target.value}) : undefined}
                    readOnly={isAuthenticated()}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className={`w-full border rounded px-3 py-2 ${isAuthenticated() ? 'bg-gray-100' : ''}`}
                    value={receiverInfo.email}
                    onChange={!isAuthenticated() ? (e) => setReceiverInfo({...receiverInfo, email: e.target.value}) : undefined}
                    readOnly={isAuthenticated()}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 ${isAuthenticated() ? 'bg-gray-100' : ''}`}
                    value={receiverInfo.address}
                    onChange={!isAuthenticated() ? (e) => setReceiverInfo({...receiverInfo, address: e.target.value}) : undefined}
                    readOnly={isAuthenticated()}
                    required
                  />
                </div>
              </div>
            </div>
            {/* Thông tin đơn hàng */}
            <div className="bg-white rounded shadow p-4 mb-0">
              <h2 className="text-lg font-semibold mb-4 text-blue-900">
                Order Information
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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Discount Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setDiscountCode("");
                    setSelectedDiscount(null);
                    setIsChoosing(false);
                  }}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-col md:flex-row gap-2 items-stretch">
                {/* Ô nhập mã */}
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={discountCode}
                  onChange={handleInputDiscount}
                  onFocus={handleFocusInput}
                  placeholder="Enter code..."
                  autoComplete="off"
                  disabled={false}
                />
                {/* Ô chọn từ danh sách */}
                <div className="relative w-full md:w-1/2 discount-dropdown">
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
                      <span>
                        Choose code<br />discount
                      </span>
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
                              Value:{" "}
                              <span className="font-semibold">{d.value}</span>
                            </span>
                            <span>
                              Expiry:{" "}
                              <span className="font-semibold">{d.expiry}</span>
                            </span>
                            <span>
                              Remaining:{" "}
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
                  Selected code: <span className="font-semibold">{info.code}</span>
                  <div className="text-gray-700 text-xs pl-2">
                    <div>
                      Remaining:{" "}
                      <span className="font-semibold">{info.remain}</span>
                    </div>
                    <div>
                      Value:{" "}
                      <span className="font-semibold">{info.value}</span>
                    </div>
                    <div>
                      Expiry:{" "}
                      <span className="font-semibold">{info.expiry}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Loại đơn hàng */}
            <div className="bg-white rounded shadow p-4 mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Type
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
                Shipping Method
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
              >
                {orderType === "PICKUP"
                  ? shippingMethods
                      .filter((m) => m.value === "PICKUP")
                      .map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))
                  : shippingMethods
                      .filter((m) => m.value !== "PICKUP")
                      .map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
              </select>
            </div>
            {/* Phương thức thanh toán */}
            {!(orderType === "PICKUP") && (
              <div className="bg-white rounded shadow p-4 mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                >
                  {paymentMethods
                    .filter((m) =>
                      orderType === "PICKUP"
                        ? m.value !== "cod"
                        : true
                    )
                    .map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                </select>
              </div>
            )}
            {/* Ghi chú */}
            <div className="bg-white rounded shadow p-4 mb-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Note
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[60px]"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter note if any..."
              />
            </div>
            {/* Tổng tiền & nút chức năng */}
            <div className="flex flex-col gap-4">
              {/* Thông tin tính tiền */}
              <div className="bg-white rounded shadow p-4">
                <h3 className="text-lg font-semibold mb-3 text-blue-900">Order Total</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total product price:</span>
                    <span className="font-medium">{totalProduct.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance fee:</span>
                    <span className="font-medium">{totalInsuranceFee.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span className="font-medium text-red-600">-{discountValue.toLocaleString("vi-VN")}₫</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold text-blue-700">
                    <span>Total:</span>
                    <span>{totalFinal.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>
              </div>
              
              {/* Nút đặt hàng */}
              <div className="flex justify-center">
                <SubmitButton
                  type="submit"
                  disabled={loading || products.length === 0}
                  className="w-full max-w-md"
                >
                  <span className="flex items-center gap-2">
                    <FaShoppingCart className="text-lg" />
                    {loading ? "Placing order..." : "Place Order"}
                  </span>
                </SubmitButton>
              </div>
              
              {/* Thông báo */}
              {success && (
                <div className="text-green-600 font-semibold text-center">
                  Order placed successfully!
                </div>
              )}
              {error && (
                <div className="text-red-600 font-semibold text-center">{error}</div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Modal chọn thông tin người nhận */}
      {showReceiverModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-900">
                  {isAddingNew ? "Add new receiver information" : "Select receiver information"}
                </h3>
                <button
                  onClick={handleCloseReceiverModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {editingReceiver ? (
                // Form thêm/sửa thông tin
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingReceiver.name}
                        onChange={(e) => setEditingReceiver({...editingReceiver, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        className="w-full border rounded px-3 py-2"
                        value={editingReceiver.phone}
                        onChange={(e) => setEditingReceiver({...editingReceiver, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full border rounded px-3 py-2"
                        value={editingReceiver.email}
                        onChange={(e) => setEditingReceiver({...editingReceiver, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={editingReceiver.address}
                        onChange={(e) => setEditingReceiver({...editingReceiver, address: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseReceiverModal}
                      className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveReceiver}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {isAddingNew ? "Add New" : "Update"}
                    </button>
                  </div>
                </div>
              ) : (
                                // Danh sách thông tin đã lưu
                <div className="space-y-4">
                  {/* Thông tin người dùng */}
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">Customer Information</h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          <div><strong>Name:</strong> {customer.name}</div>
                          <div><strong>Phone:</strong> {customer.phone}</div>
                          <div><strong>Email:</strong> {customer.email}</div>
                          <div><strong>Address:</strong> {customer.address}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectReceiver(customer)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Select
                      </button>
                    </div>
                  </div>

                  {/* Danh sách thông tin người nhận từ server (chỉ hiển thị khi đã đăng nhập) */}
                  {isAuthenticated() && serverReceivers.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Saved Receiver Information</h4>
                      <div className="space-y-3">
                        {serverReceivers.map((receiver) => (
                          <div key={receiver.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-sm text-gray-700 space-y-1">
                                  <div><strong>Name:</strong> {receiver.name || 'No name'}</div>
                                  <div><strong>Phone:</strong> {receiver.phone}</div>
                                  <div><strong>Email:</strong> {receiver.email}</div>
                                  <div><strong>Address:</strong> {receiver.address}</div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditReceiver(receiver)}
                                  className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleSelectReceiver(receiver)}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                >
                                  Select
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Danh sách thông tin đã lưu local (chỉ hiển thị khi chưa đăng nhập) */}
                  {!isAuthenticated() && savedReceivers.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Saved Information</h4>
                      <div className="space-y-3">
                        {savedReceivers.map((receiver) => (
                          <div key={receiver.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-sm text-gray-700 space-y-1">
                                  <div><strong>Name:</strong> {receiver.name}</div>
                                  <div><strong>Phone:</strong> {receiver.phone}</div>
                                  <div><strong>Email:</strong> {receiver.email}</div>
                                  <div><strong>Address:</strong> {receiver.address}</div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditReceiver(receiver)}
                                  className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteReceiver(receiver.id)}
                                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => handleSelectReceiver(receiver)}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                >
                                  Select
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Nút thêm mới */}
                  <div className="pt-4">
                    <button
                      onClick={handleAddNewReceiver}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                      + Add new receiver information
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
      
      {/* Compare Sidebar */}
      <CompareSidebar />
    </div>
  );
};

export default Checkout;
