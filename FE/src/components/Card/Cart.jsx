import { useState } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartCard = ({
  image = 'https://placehold.co/80x80',
  name = 'Apple iPhone 15 Pro',
  price = 899.0,
  quantity = 1,
  onQuantityChange = () => {},
  onRemove = () => {},
}) => {
  const [qty, setQty] = useState(quantity);

  const handleDecrease = () => {
    if (qty > 1) {
      setQty(qty - 1);
      onQuantityChange(qty - 1);
    }
  };
  const handleIncrease = () => {
    setQty(qty + 1);
    onQuantityChange(qty + 1);
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow border border-gray-200 mb-4">
      <img src={image} alt={name} className="w-20 h-20 object-cover rounded-lg border" />
      <div className="flex-1">
        <div className="font-semibold text-base text-zinc-800 mb-1">{name}</div>
        <div className="text-blue-700 font-bold text-lg mb-2">${price.toFixed(2)}</div>
        <div className="flex items-center gap-2">
          <button onClick={handleDecrease} className="p-1 bg-gray-100 rounded hover:bg-gray-200"><FaMinus size={12} /></button>
          <span className="px-3 text-base">{qty}</span>
          <button onClick={handleIncrease} className="p-1 bg-gray-100 rounded hover:bg-gray-200"><FaPlus size={12} /></button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="text-zinc-700 font-medium text-base">Total: <span className="font-bold">${(price * qty).toFixed(2)}</span></div>
        <button onClick={onRemove} className="text-red-500 hover:text-red-700 p-2"><FaTrash size={16} /></button>
      </div>
    </div>
  );
};

export default CartCard;
