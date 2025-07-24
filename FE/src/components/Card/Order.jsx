import { FaBoxOpen } from "react-icons/fa";

const OrderCard = ({
  orderId = "ORD123456",
  orderDate = "2024-05-01",
  status = "Delivered",
  products = [
    { image: "https://placehold.co/60x60", name: "iPhone 15 Pro", quantity: 1 },
    { image: "https://placehold.co/60x60", name: "AirPods Pro", quantity: 2 },
  ],
  total = 1299.0,
  onViewDetail = () => {},
}) => {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-blue-900 font-bold text-lg">
          <FaBoxOpen className="text-blue-700" />
          <span>Order #{orderId}</span>
        </div>
        <span className="text-sm text-zinc-500">{orderDate}</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === "Delivered"
              ? "bg-green-100 text-green-700"
              : status === "Shipping"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="flex flex-wrap gap-4 mb-3">
        {products.map((p, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 bg-zinc-50 rounded p-2"
          >
            <img
              src={p.image}
              alt={p.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <div className="font-medium text-zinc-800 text-sm">{p.name}</div>
              <div className="text-xs text-zinc-500">Qty: {p.quantity}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="text-base text-zinc-700 font-semibold">
          Total: <span className="text-blue-700">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={onViewDetail}
          className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
