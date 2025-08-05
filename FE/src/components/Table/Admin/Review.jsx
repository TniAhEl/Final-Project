import { useEffect, useState } from "react";
import {
  getAllProductReviews,
  replyProductReview,
} from "../../../api/orderService";
import { FaStar } from "react-icons/fa";

const ratingOptions = [5, 4, 3, 2, 1];

const ReviewAdminTable = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [replyingReview, setReplyingReview] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    getAllProductReviews({
      page,
      size,
      rating: selectedRatings.length === 1 ? selectedRatings[0] : undefined,
      status: statusFilter || undefined,
    })
      .then((res) => {
        const data = res.data?.data || [];
        setReviews(Array.isArray(data) ? data : []);
        setTotalPages(res.data?.totalPages || 1);
        setLoading(false);
      })
      .catch(() => {
        setError("Cannot load review list.");
        setLoading(false);
      });
  }, [page, size, selectedRatings, statusFilter]);

  // Filter by rating and time
  const filteredReviews = reviews.filter((r) => {
    const created = r.createAt ? new Date(r.createAt) : null;
    let ok = true;
    if (dateFrom && created && created < new Date(dateFrom)) ok = false;
    if (dateTo && created && created > new Date(dateTo)) ok = false;
    return ok;
  });

  const handleReply = (review) => {
    setReplyingReview(review);
    setReplyContent("");
    setReplySuccess(false);
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    setReplyLoading(true);
    try {
      await replyProductReview({
        reviewId: replyingReview.id,
        adminId: 1,
        reply: replyContent,
      });
      setReplySuccess(true);
      setTimeout(() => {
        setReplyingReview(null);
        setReplySuccess(false);
      }, 1200);
    } catch (err) {
      alert("Reply failed!");
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="flex gap-6 w-full">
      {/* Sidebar filter */}
      <div className="w-64 bg-white rounded shadow p-4 flex flex-col gap-6 h-fit">
        <div>
          <div className="font-semibold mb-2 text-blue-900">
            Filter by Date
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-600">From Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <label className="text-xs text-gray-600">To Date</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2 text-blue-900">
            Filter by Rating
          </div>
          <div className="flex flex-col gap-1">
            {ratingOptions.map((star) => (
              <label
                key={star}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedRatings.includes(star)}
                  onChange={(e) => {
                    setSelectedRatings((r) =>
                      e.target.checked
                        ? [...r, star]
                        : r.filter((s) => s !== star)
                    );
                  }}
                />
                <span className="flex items-center gap-1">
                  {[...Array(star)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                  <span className="ml-1 text-xs text-gray-700">{star} star</span>
                </span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold mb-2 text-blue-900">
            Filter by Status
          </div>
          <select
            className="border rounded px-2 py-1 w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="NEW">New</option>
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="flex-1 bg-white rounded shadow p-4 overflow-x-auto">
        <div className="text-xl font-bold mb-4 text-blue-900">
          Product Review List
        </div>
        {loading ? (
          <div className="text-center py-8 text-blue-600">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-3 py-2 border-b text-left">
                    Reviewer
                  </th>
                  <th className="px-3 py-2 border-b text-left">Rating</th>
                  <th className="px-3 py-2 border-b text-left">Content</th>
                  <th className="px-3 py-2 border-b text-left">
                    Review Date
                  </th>
                  <th className="px-3 py-2 border-b text-left">Status</th>
                  <th className="px-3 py-2 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-8">
                      No reviews found
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((r, idx) => (
                    <tr key={r.id || idx} className="border-b hover:bg-blue-50">
                      <td className="px-3 py-2 font-semibold text-blue-900">
                        {r.user
                          ? `${r.user.lastName || ""} ${
                              r.user.firstName || ""
                            }`.trim()
                          : ""}
                      </td>
                      <td className="px-3 py-2">
                        <span className="flex items-center gap-1">
                          {[...Array(Number(r.rating) || 0)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                          ))}
                          <span className="ml-1 text-xs text-gray-700">
                            {r.rating}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-800">{r.review}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">
                        {r.createAt
                          ? new Date(r.createAt).toLocaleDateString("vi-VN")
                          : ""}
                      </td>
                      <td className="px-3 py-2 text-xs font-semibold">
                        {r.status === "APPROVED" ? (
                          <span className="text-green-600">Approved</span>
                        ) : r.status === "PENDING" ? (
                          <span className="text-yellow-600">Pending</span>
                        ) : (
                          <span className="text-red-600">New</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <button
                          className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold transition"
                          onClick={() => handleReply(r)}
                        >
                          Reply
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-6 select-none">
              <button
                onClick={() => setPage(0)}
                disabled={page === 0}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
                title="First page"
              >
                &#171;
              </button>
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
                title="Previous"
              >
                &#8249;
              </button>
              {Array.from({ length: totalPages }, (_, i) => i)
                .filter(
                  (i) =>
                    i === 0 || i === totalPages - 1 || Math.abs(i - page) <= 2
                )
                .map((i, idx, arr) => (
                  <span key={i}>
                    {idx > 0 && i - arr[idx - 1] > 1 && (
                      <span className="px-1 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setPage(i)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full mx-0.5 font-semibold transition-colors
                      ${
                        i === page
                          ? "bg-blue-600 text-white shadow"
                          : "bg-gray-100 hover:bg-blue-100 text-gray-700"
                      }`}
                      aria-current={i === page ? "page" : undefined}
                    >
                      {i + 1}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
                title="Next"
              >
                &#8250;
              </button>
              <button
                onClick={() => setPage(totalPages - 1)}
                disabled={page >= totalPages - 1}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-40"
                title="Last page"
              >
                &#187;
              </button>
              <div className="flex items-center ml-4">
                <span className="mr-2 text-gray-600 text-sm">
                  Rows per page:
                </span>
                <select
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setPage(0);
                  }}
                  className="px-2 py-1 border rounded text-sm"
                >
                  {[5, 10, 20, 50].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Popup answer review */}
      {replyingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-opacity-20 backdrop-blur-sm"
            onClick={() => setReplyingReview(null)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-popup-in border border-slate-200 z-10">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors duration-200 focus:outline-none"
              onClick={() => setReplyingReview(null)}
              title="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Reply to Review
            </h2>
            <div className="mb-2">
              <div className="font-semibold text-blue-900">
                {replyingReview.user
                  ? `${replyingReview.user.lastName || ""} ${
                      replyingReview.user.firstName || ""
                    }`.trim()
                  : ""}
              </div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(Number(replyingReview.rating) || 0)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
                <span className="ml-1 text-xs text-gray-700">
                  {replyingReview.rating}/5
                </span>
              </div>
              <div className="text-gray-800 text-base font-medium whitespace-pre-line mb-1">
                {replyingReview.review}
              </div>
              <div className="text-xs text-gray-500">
                {replyingReview.createAt
                  ? new Date(replyingReview.createAt).toLocaleDateString(
                      "vi-VN"
                    )
                  : ""}
              </div>
            </div>
            <form
              onSubmit={handleSubmitReply}
              className="flex flex-col gap-4 mt-2"
            >
              <textarea
                className="w-full border rounded px-3 py-2 min-h-[80px]"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Enter reply content..."
                required
                disabled={replyLoading || replySuccess}
              />
              {replySuccess && (
                <div className="text-green-600 text-sm">
                  Reply sent successfully!
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  className="px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={() => setReplyingReview(null)}
                  disabled={replyLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                  disabled={replyLoading || replySuccess}
                >
                  {replyLoading ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewAdminTable;
