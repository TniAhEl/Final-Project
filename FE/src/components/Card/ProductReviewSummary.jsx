import React from "react";
import { FaStar } from "react-icons/fa";
import ReviewCard from "./Review";

/**
 * ProductReviewSummary component
 * @param {Object} props
 * @param {number} props.avgRating - Điểm trung bình
 * @param {number} props.total - Tổng số đánh giá
 * @param {Object} props.ratingCounts - Số lượng đánh giá theo từng mức sao (ví dụ: {5: 10, 4: 3, ...})
 * @param {Array} props.reviews - Danh sách review (mỗi phần tử là object truyền cho ReviewCard)
 */
const ProductReviewSummary = ({
  avgRating = 0,
  total = 0,
  ratingCounts = {},
  reviews = [],
}) => {
  return (
    <div className="w-full  mx-auto bg-white rounded shadow p-6 flex flex-col gap-6">
      {/* Tổng quan điểm trung bình và tổng số đánh giá */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex flex-col items-center md:w-1/3">
          <div className="text-4xl font-bold text-yellow-500">
            {avgRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.round(avgRating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Trung bình trên {total} đánh giá
          </div>
        </div>
        {/* Biểu đồ số lượng đánh giá theo từng mức sao */}
        <div className="flex-1 flex flex-col gap-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2">
              <span className="w-8 text-sm text-gray-700 font-medium">
                {star} <FaStar className="inline text-yellow-400 mb-0.5" />
              </span>
              <div className="flex-1 bg-gray-100 rounded h-3 relative">
                <div
                  className="bg-yellow-400 h-3 rounded"
                  style={{
                    width: total
                      ? `${((ratingCounts[star] || 0) / total) * 100}%`
                      : "0%",
                  }}
                ></div>
              </div>
              <span className="w-8 text-xs text-gray-500 text-right">
                {ratingCounts[star] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Danh sách review card */}
      <div className="flex flex-col gap-4">
        {reviews.length === 0 ? (
          <div className="text-gray-400 text-center">
            Chưa có đánh giá nào cho sản phẩm này.
          </div>
        ) : (
          reviews.map((r, idx) => (
            <div key={idx} className="">
              <div className="font-semibold text-blue-900 mb-1">
                {r.reviewer}
              </div>
              <ReviewCard {...r} />
              {/* Hiển thị reply nếu có */}
              {r.reply && r.reply.reply && (
                <div className="mt-2 ml-4 p-3 bg-gray-50 border-l-4 border-blue-300 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-blue-700">
                      {r.reply.admin
                        ? `${r.reply.admin.firstName || ""} ${
                            r.reply.admin.lastName || ""
                          }`.trim()
                        : "Admin"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {r.reply.updateAt
                        ? new Date(r.reply.updateAt).toLocaleDateString("vi-VN")
                        : ""}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm whitespace-pre-line">
                    {r.reply.reply}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviewSummary;
