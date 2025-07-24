import { FaTag, FaRegCopy } from "react-icons/fa";
import { useState } from "react";

const PromotionCard = ({
  title = "Summer Sale",
  description = "Get amazing discounts on all products!",
  code = "SUMMER2024",
  discount = 20,
  expiry = "2024-06-30",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl shadow p-5 flex flex-col gap-3 max-w-md">
      <div className="flex items-center gap-2 text-yellow-700 font-bold text-lg">
        <FaTag />
        <span>{title}</span>
      </div>
      <div className="text-zinc-700 text-base mb-1">{description}</div>
      <div className="flex items-center gap-2 mb-1">
        <span className="bg-yellow-200 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
          -{discount}%
        </span>
        <span className="text-xs text-zinc-500">Expires: {expiry}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono bg-yellow-100 px-3 py-1 rounded text-yellow-900 text-base font-semibold">
          {code}
        </span>
        <button
          onClick={handleCopy}
          className="p-2 rounded bg-yellow-200 hover:bg-yellow-300 transition text-yellow-900"
        >
          <FaRegCopy />
        </button>
        {copied && <span className="text-green-600 text-xs ml-2">Copied!</span>}
      </div>
    </div>
  );
};

export default PromotionCard;
