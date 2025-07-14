import { FaFileContract } from 'react-icons/fa';

const InsuranceCard = ({
  insuranceId = 'INS123456',
  productName = 'Apple iPhone 15 Pro',
  startDate = '2024-01-01',
  endDate = '2025-01-01',
  status = 'Active',
  amount = 200.0,
  onViewDetail = () => {},
}) => {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-xl shadow p-5 flex flex-col gap-3 max-w-md">
      <div className="flex items-center gap-2 text-purple-700 font-bold text-lg mb-1">
        <FaFileContract />
        <span>Insurance #{insuranceId}</span>
      </div>
      <div className="text-zinc-800 font-medium text-base mb-1">{productName}</div>
      <div className="flex items-center gap-4 mb-1">
        <span className="text-xs text-zinc-500">Start: {startDate}</span>
        <span className="text-xs text-zinc-500">End: {endDate}</span>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'Active' ? 'bg-green-100 text-green-700' : status === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{status}</span>
        <span className="text-xs text-purple-700 font-semibold ml-2">Amount: ${amount.toFixed(2)}</span>
      </div>
      <button onClick={onViewDetail} className="px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition text-sm font-medium self-end">View Details</button>
    </div>
  );
};

export default InsuranceCard;
