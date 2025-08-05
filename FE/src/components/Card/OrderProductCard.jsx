import React, { useState } from "react";
import DeleteButton from "../Button/Delete";

const OrderProductCard = ({
  product,
  onChangeQuantity,
  onRemove,
  updatingId,
  insurances = [],
  onSelectInsurance,
  selectedInsurance,
}) => {
  const [showInsurance, setShowInsurance] = useState(false);
  const [selected, setSelected] = useState(
    selectedInsurance?.insuranceId || null
  );
  const [insuranceQty, setInsuranceQty] = useState(
    selectedInsurance?.quantity || 1
  );

  const handleSelect = (id) => {
    setSelected(id);
    setInsuranceQty(1);
  };

  // Only save insurance selection to parent state, do not submit order
  const handleConfirm = () => {
    if (onSelectInsurance && selected) {
      onSelectInsurance({
        insuranceId: selected,
        productOptionId: product.id,
        quantity: insuranceQty,
      });
      setShowInsurance(false);
    }
  };

  if (!product) return null;
  return (
    <div className="flex flex-col border-b pb-3 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="font-medium text-gray-800">
            {product.productOption?.productName || product.name}
          </div>
          <div className="text-xs text-gray-500">
            Màu:{" "}
            {product.colorName ||
              product.productOption?.colorName ||
              product.option?.colorName}{" "}
            | RAM:{" "}
            {product.ram || product.productOption?.ram || product.option?.ram}GB
            | ROM:{" "}
            {product.rom || product.productOption?.rom || product.option?.rom}GB
          </div>
          <div className="flex items-center gap-2 ">
            <span className="text-xs text-gray-500">Amount:</span>
            <button
              type="button"
              className="text-lg text-gray-700 hover:text-blue-600 disabled:opacity-40"
              onClick={() => onChangeQuantity(product.id, -1)}
              disabled={product.quantity === 1 || updatingId === product.id}
            >
              {updatingId === product.id ? (
                <span className="animate-spin inline-block w-4 h-4 border-b-2 border-blue-500 rounded-full"></span>
              ) : (
                "-"
              )}
            </button>
            <span className="w-6 text-center select-none">
              {product.quantity}
            </span>
            <button
              type="button"
              className="text-lg text-gray-700 hover:text-blue-600 disabled:opacity-40"
              onClick={() => onChangeQuantity(product.id, 1)}
              disabled={
                updatingId === product.id ||
                (product.availableQuantity !== undefined &&
                  product.quantity >= product.availableQuantity)
              }
            >
              {updatingId === product.id ? (
                <span className="animate-spin inline-block w-4 h-4 border-b-2 border-blue-500 rounded-full"></span>
              ) : (
                "+"
              )}
            </button>
            {product.availableQuantity !== undefined && (
              <span className="text-xs text-gray-500 ml-2">
                ( {product.availableQuantity} available)
              </span>
            )}
          </div>
          <div className="text-sm font-semibold text-blue-700">
            {(
              product.productOption?.price ||
              product.price ||
              0
            ).toLocaleString("vi-VN")}
            ₫
          </div>
        </div>
        <DeleteButton onClick={() => onRemove(product.id)} />
        <button
          type="button"
          className="ml-4 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-xs font-medium"
          onClick={() => setShowInsurance((v) => !v)}
        >
          {selectedInsurance ? "Already selected" : "Select insurance"}
        </button>
      </div>
      {showInsurance && (
        <div className="mt-3 p-3 bg-blue-50 rounded shadow-inner">
          <div className="mb-2 font-semibold text-blue-900">
            Select insurance for this product
          </div>
          <div className="flex flex-col gap-2">
            {insurances.length === 0 && (
              <div className="text-gray-500 text-sm">
                No insurance plans available.
              </div>
            )}
            {insurances.map((ins) => (
              <label
                key={ins.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`insurance-${product.id}`}
                  checked={selected === ins.id}
                  onChange={() => handleSelect(ins.id)}
                />
                <span className="font-medium text-gray-800">{ins.name}</span>
                <span className="text-xs text-gray-500">({ins.provider})</span>
                <span className="text-xs text-gray-500 ml-2">
                  Fee: {(ins.fee || 0).toLocaleString()}₫
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  Status: {ins.status || "N/A"}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  Insurance: {(ins.coverageMoney || 0).toLocaleString()}₫
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  Terms: {ins.terms}
                </span>
              </label>
            ))}
          </div>
          {selected && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-700">Insurance quantity:</span>
              <button
                type="button"
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setInsuranceQty((q) => Math.max(1, q - 1))}
                disabled={insuranceQty <= 1}
              >
                -
              </button>
              <span className="mx-2">{insuranceQty}</span>
              <button
                type="button"
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() =>
                  setInsuranceQty((q) => Math.min(product.quantity, q + 1))
                }
                disabled={insuranceQty >= product.quantity}
              >
                +
              </button>
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold"
              onClick={handleConfirm}
              disabled={!selected}
            >
              Confirm
            </button>
            <button
              type="button"
              className="px-4 py-1 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 text-xs font-semibold"
              onClick={() => setShowInsurance(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderProductCard;
