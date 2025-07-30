import React from "react";
import { FaStar } from "react-icons/fa";
import ReviewCard from "./Review";

/**
 * ProductReviewSummary component
 * @param {Object} props
 * @param {number} props.avgRating - Average rating
 * @param {number} props.total - Total reviews
 * @param {Object} props.ratingCounts - Number of reviews by star rating (e.g., {5: 10, 4: 3, ...})
 * @param {Array} props.reviews - List of reviews (each element is an object passed to ReviewCard)
 */
const ProductReviewSummary = ({
  avgRating = 0,
  total = 0,
  ratingCounts = {},
  reviews = [],
}) => {
  return (
    <div className="w-full  mx-auto bg-white rounded shadow p-6 flex flex-col gap-6">
      {/* Overview */}
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
        {/* Chart of review counts by star rating */}
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
      {/* List of review cards */}
      <div className="flex flex-col gap-4">
        {reviews.length === 0 ? (
          <div className="text-gray-400 text-center">
            No reviews for this product yet.
          </div>
        ) : (
          reviews.map((r, idx) => (
            <div key={idx} className="">
              <div className="font-semibold text-blue-900 mb-1">
                {r.reviewer}
              </div>
              <ReviewCard {...r} />
              {/* Show reply if exists */}
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
