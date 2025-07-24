import { useState } from "react";
import { FaStar } from "react-icons/fa";

const ReviewPopup = ({ open, onClose, product, orderId, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [hover, setHover] = useState(null);

  if (!open) return null;

  // Lấy tên người mua từ product hoặc truyền thêm prop nếu cần
  const buyerName =
    product?.buyerName || product?.customerName || product?.userName || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await onSubmit({
        rating,
        review,
        productId: product?.id,
        orderId,
      });
      setSuccess(true);
      setReview("");
      setRating(5);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError("Gửi đánh giá thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay chỉ làm mờ, không màu đen */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      {/* Popup */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-popup-in border border-slate-200 z-10">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200 focus:outline-none"
          onClick={onClose}
          title="Đóng"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          Đánh giá sản phẩm
        </h2>
        {/* Thông tin sản phẩm và người mua */}
        <div className="mb-2 font-medium text-gray-700">
          <div className="mb-1">
            Sản phẩm:{" "}
            <span className="font-semibold text-blue-700">{product?.name}</span>
            {product?.colorName && (
              <span className="ml-2 text-xs text-gray-500">
                Màu: <span className="font-semibold">{product.colorName}</span>
              </span>
            )}
            {product?.ram && (
              <span className="ml-2 text-xs text-gray-500">
                RAM: <span className="font-semibold">{product.ram}GB</span>
              </span>
            )}
            {product?.rom && (
              <span className="ml-2 text-xs text-gray-500">
                ROM: <span className="font-semibold">{product.rom}GB</span>
              </span>
            )}
          </div>
          {buyerName && (
            <div>
              Người mua:{" "}
              <span className="font-semibold text-gray-800">{buyerName}</span>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số sao
            </label>
            <div className="flex gap-1 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(null)}
                  className="focus:outline-none"
                  tabIndex={-1}
                >
                  <FaStar
                    size={28}
                    className={
                      (hover || rating) >= star
                        ? "text-yellow-400 drop-shadow-sm"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600 font-medium">
                {rating} sao
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nội dung đánh giá
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 min-h-[80px]"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Nhập nhận xét của bạn..."
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm">
              Gửi đánh giá thành công!
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
              onClick={onClose}
              disabled={loading}
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewPopup;
