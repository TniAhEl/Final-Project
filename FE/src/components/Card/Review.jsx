import { FaStar } from "react-icons/fa";

/**
 * ReviewCard component
 * @param {Object} props
 * @param {number} props.rating - Số lượng sao (1-5)
 * @param {string} props.content - Nội dung đánh giá
 * @param {string} props.reviewer - Tên người đánh giá
 * @param {string} props.time - Thời gian đánh giá (định dạng chuỗi)
 * @param {string} props.status - Trạng thái đánh giá (duyệt/chờ duyệt/từ chối)
 */
const ReviewCard = ({
  rating = 5,
  content = "",
  reviewer = "",
  time = "",
  status = "",
}) => {
  // Định nghĩa màu trạng thái
  const statusColor =
    status === "APPROVED"
      ? "text-green-600"
      : status === "PENDING"
      ? "text-yellow-600"
      : "text-red-600";
  const statusLabel =
    status === "APPROVED"
      ? "Đã duyệt"
      : status === "PENDING"
      ? "Chờ duyệt"
      : "NEW";

  return (
    <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-2 border border-gray-100 w-full">
      {/* Reviewer in đậm trên cùng nếu có */}
      {reviewer && (
        <div className="font-semibold text-blue-900 text-base mb-1">
          {reviewer}
        </div>
      )}
      {/* Rating (sao) và giới thiệu */}
      {typeof rating === "number" && rating > 0 && (
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < rating ? "text-yellow-400" : "text-gray-300"}
            />
          ))}
          <span className="ml-2 text-xs text-gray-500">{rating}/5</span>
          <span className="flex items-center gap-1 text-pink-600 font-medium text-xs ml-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-pink-500"
            >
              <path d="M9.674 17.726c.217.16.435.274.65.274.215 0 .433-.114.65-.274C15.6 15.2 18 12.98 18 10.25c0-2.07-1.68-3.75-3.75-3.75-1.13 0-2.13.52-2.75 1.34C10.88 7.02 9.88 6.5 8.75 6.5 6.68 6.5 5 8.18 5 10.25c0 2.73 2.4 4.95 4.674 7.476z" />
            </svg>
            Sẽ giới thiệu cho bạn bè, người thân
          </span>
        </div>
      )}
      {/* Nội dung đánh giá */}
      {content && (
        <div className="text-gray-800 text-base font-medium whitespace-pre-line">
          {content}
        </div>
      )}
      {/* Thời gian đánh giá */}
      {time && <div className="text-xs text-gray-500 mt-1">{time}</div>}
      {/* Trạng thái đánh giá */}
      {status && (
        <div className={`text-xs font-semibold ${statusColor}`}>
          Trạng thái: {statusLabel}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
