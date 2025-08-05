import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderAuth from "../../components/Header/HeaderAuth";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductLayout from "../../layouts/ProductLayout";
import ProductReviewSummary from "../../components/Card/ProductReviewSummary";
import CompareSidebar from "../../components/Sidebar/Compare";
import { getProductReviews } from "../../api/orderService";
import { getProductById } from "../../api/productService";
import { 
  addToLocalCart, 
  isAuthenticated, 
  getLocalCartItemCount 
} from "../../services/localCartService";
import { addProductToCart } from "../../api/cartService";

const Details = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Option selection state from ProductLayout
  const [selectedOption, setSelectedOption] = useState(null);
  const [reviewData, setReviewData] = useState({
    avgRating: 0,
    total: 0,
    ratingCounts: {},
    reviews: [],
  });
  
  // Cart state
  const [cartItemCount, setCartItemCount] = useState(0);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [addToCartMessage, setAddToCartMessage] = useState("");

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
         url: processedData.image.imageUrl ? `${baseUrl}${processedData.image.imageUrl}` : processedData.image.url || "https://placehold.co/600x800"
       };
     } else if (processedData.image && Array.isArray(processedData.image)) {
       // Array of images
       processedData.image = processedData.image.map(img => ({
         ...img,
         url: img.imageUrl ? `${baseUrl}${img.imageUrl}` : img.url || "https://placehold.co/600x800"
       }));
     }
    
         // Process productImageResponse if exists (old format)
     if (processedData.productImageResponse && Array.isArray(processedData.productImageResponse)) {
       processedData.productImageResponse = processedData.productImageResponse.map(img => ({
         ...img,
         url: img.imageUrl ? `${baseUrl}${img.imageUrl}` : img.url || "https://placehold.co/600x800"
       }));
     }
     
     // Process images array if exists (old format)
     if (processedData.images && Array.isArray(processedData.images)) {
       processedData.images = processedData.images.map(img => ({
         ...img,
         url: img.imageUrl ? `${baseUrl}${img.imageUrl}` : img.url || "https://placehold.co/600x800"
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
         url: "https://placehold.co/600x800",
         fileName: "placeholder.png"
       };
     }

    return processedData;
  };

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((data) => {

        let prod = null;
        if (data && data.data && data.data.name) {
          // New API format with message and data
          prod = processProductImages(data.data);
        } else if (data && data.name) {
          // Direct product object
          prod = processProductImages(data);
        } else if (
          data &&
          typeof data === "object" &&
          data.data &&
          data.data.name
        ) {
          // Fallback format
          prod = processProductImages(data.data);
        }
        
        setProduct(prod);
        setLoading(false);
        
        // Get real reviews
        if (prod && prod.id) {
          getProductReviews(prod.id)
            .then((res) => {
              const reviewsArr = Array.isArray(res.data) ? res.data : [];
              const total = reviewsArr.length;
              let sum = 0;
              const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
              const reviews = reviewsArr.map((r) => {
                const rating = Number(r.rating) || 0;
                sum += rating;
                if (ratingCounts[rating] !== undefined) ratingCounts[rating]++;
                return {
                  rating,
                  content: r.review,
                  reviewer: r.user
                    ? `${r.user.lastName || ""} ${
                        r.user.firstName || ""
                      }`.trim()
                    : "",
                  time: r.createAt,
                  status: r.status,
                  reply: r.reply,
                };
              });
              setReviewData({
                avgRating: total ? sum / total : 0,
                total,
                ratingCounts,
                reviews,
              });
            })
            .catch(() => {
              setReviewData({
                avgRating: 0,
                total: 0,
                ratingCounts: {},
                reviews: [],
              });
            });
        }
      })
      .catch(() => {
        setError("Failed to load product details.");
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [id]);

  // Callback to receive selected option from ProductLayout
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  // Update cart item count
  useEffect(() => {
    setCartItemCount(getLocalCartItemCount());
  }, []);

  // Function to show notification on homepage
  const showNotificationOnHomepage = (message, type = "success") => {
    localStorage.setItem("showNotification", "true");
    localStorage.setItem("notificationMessage", message);
    window.dispatchEvent(new CustomEvent("showNotification", { detail: { message, type } }));
  };

  // Handle add to cart
  const handleAddToCart = async (quantity = 1) => {
    if (!selectedOption || !selectedOption.id) {
      showNotificationOnHomepage("Vui lòng chọn phiên bản sản phẩm!", "error");
      return;
    }

    setAddToCartLoading(true);
    setAddToCartMessage("");

    try {
      if (isAuthenticated()) {
        // User is logged in - add to server cart
        const userId = localStorage.getItem('userId');
        await addProductToCart(userId, {
          productOptionId: selectedOption.id,
          quantity: quantity
        });
        showNotificationOnHomepage("Đã thêm sản phẩm vào giỏ hàng!");
      } else {
        // User is not logged in - add to local cart
        addToLocalCart({
          productOptionId: selectedOption.id,
          quantity: quantity,
          name: product.name,
          price: selectedOption.price,
          image: product.productImageResponse?.[0]?.url || 'https://placehold.co/80x80'
        });
        showNotificationOnHomepage("Đã thêm sản phẩm vào giỏ hàng tạm thời!");
        setCartItemCount(getLocalCartItemCount());
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotificationOnHomepage("Có lỗi xảy ra khi thêm vào giỏ hàng!", "error");
    } finally {
      setAddToCartLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <HeaderAuth />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading Product Detail...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <HeaderAuth />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  if (!product || typeof product !== "object" || !product.name)
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {isAuthenticated() ? <HeaderAuth /> : <Header />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">
              Product not found or invalid data.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );

  // Helper render
  const InfoRow = ({ label, value }) =>
    value !== undefined && value !== null && value !== "" ? (
      <div className="flex mb-2">
        <span className="w-40 font-medium text-gray-600">{label}:</span>{" "}
        <span className="flex-1">{value}</span>
      </div>
    ) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {isAuthenticated() ? <HeaderAuth /> : <Header />}
      <ProductLayout
        productData={product}
        onOptionChange={handleOptionChange}
        onAddToCart={handleAddToCart}
        addToCartLoading={addToCartLoading}
        addToCartMessage={addToCartMessage}
        cartItemCount={cartItemCount}
      />
      <div className="flex-1 max-w-7xl mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">
        {/* Left: Product Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Configuration */}
          <div className="bg-white rounded shadow p-6 mb-4">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <InfoRow label="Operating System" value={product.os} />
                <InfoRow label="CPU" value={product.cpu} />
                <InfoRow
                  label="CPU Speed"
                  value={
                    product.cpuSpeed ? `${product.cpuSpeed} GHz` : undefined
                  }
                />
                <InfoRow label="GPU" value={product.gpu} />
                <InfoRow label="RAM" value={product.ramOptions?.join(", ")} />
                <InfoRow label="Storage" value={product.storage} />
                <InfoRow
                  label="Battery Capacity"
                  value={
                    product.batteryCapacity
                      ? `${product.batteryCapacity} mAh`
                      : undefined
                  }
                />
                <InfoRow label="Battery Type" value={product.batteryType} />
                <InfoRow label="Battery Tech" value={product.batteryTech} />
                <InfoRow label="Charge Support" value={product.chargeSupport} />
                <InfoRow label="Charge Port" value={product.chargePort} />
              </div>
            </div>
          </div>
          {/* Camera & Screen */}
          <div className="bg-white rounded shadow p-6 mb-4">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              Camera & Screen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <InfoRow label="Screen Size" value={product.screenDimension} />
                <InfoRow
                  label="Screen Resolution"
                  value={product.screenResolution}
                />
                <InfoRow label="Screen Tech" value={product.screenTech} />
                <InfoRow label="Screen Touch" value={product.screenTouch} />
                <InfoRow label="Max Brightness" value={product.maxBrightness} />
              </div>
              <div>
                <InfoRow label="Front Camera" value={product.frontCamera} />
                <InfoRow label="Back Camera" value={product.backCamera} />
                <InfoRow
                  label="Back Camera Tech"
                  value={product.backCameraTech}
                />
                <InfoRow
                  label="Back Camera Record"
                  value={product.backCameraRecord}
                />
                <InfoRow label="Flash" value={product.flash ? "Yes" : "No"} />
              </div>
            </div>
          </div>
          {/* Design & Material */}
          <div className="bg-white rounded shadow p-6 mb-4">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              Design & Material
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <InfoRow label="Design" value={product.design} />
                <InfoRow label="Material" value={product.material} />
                <InfoRow label="Dimension" value={product.dimension} />
                <InfoRow label="Weight" value={product.weight} />
              </div>
            </div>
          </div>
          {/* Connection */}
          <div className="bg-white rounded shadow p-6 mb-4">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              Connection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <InfoRow label="Earphone Port" value={product.earphonePort} />
                <InfoRow label="Another Port" value={product.anotherPort} />
                <InfoRow label="Bluetooth" value={product.bluetooth} />
                <InfoRow label="WiFi" value={product.wifi} />
                <InfoRow label="GPS" value={product.gps} />
                <InfoRow label="Mobile Network" value={product.mobileNetwork} />
                <InfoRow label="SIM" value={product.sim} />
              </div>
            </div>
          </div>
          {/* Utilities & Warranty */}
          <div className="bg-white rounded shadow p-6 mb-4">
            <h2 className="text-xl font-semibold mb-4 text-blue-900">
              Utilities
            </h2>
            <InfoRow label="Music Utility" value={product.musicUtil} />
            <InfoRow label="Movie Utility" value={product.movieUtil} />
            <InfoRow label="Record Utility" value={product.recordUtil} />
            <InfoRow
              label="Resistance Utility"
              value={product.resistanceUtil}
            />
            <InfoRow label="Special Utility" value={product.specialUtil} />
          </div>
          {/* Warranty */}
          {product.warranty && (
            <div className="bg-white rounded shadow p-6 mb-4">
              <h2 className="text-xl font-semibold mb-4 text-blue-900">
                Warranty
              </h2>
              <InfoRow
                label="Duration (months)"
                value={product.warranty.duration}
              />
              <InfoRow label="Condition" value={product.warranty.condition} />
              <InfoRow label="Exception" value={product.warranty.exception} />
              <InfoRow label="Note" value={product.warranty.note} />
            </div>
          )}
        </div>
        {/* Right: Review */}
        <div className="w-full md:w-[420px] flex-shrink-0">
          <div className="bg-white rounded shadow p-6 mb-4 w-full">
            <ProductReviewSummary
              avgRating={reviewData.avgRating}
              total={reviewData.total}
              ratingCounts={reviewData.ratingCounts}
              reviews={reviewData.reviews}
            />
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Compare Sidebar */}
      <CompareSidebar />
    </div>
  );
};

export default Details;
