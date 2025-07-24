import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartCard = (props) => {
  // Prefer product fields if available, fallback to direct props
  const product = props.product || {};
  const image = product.image || props.image || 'https://placehold.co/80x80';
  const name = product.name || props.name || 'Product';
  const price = product.price || props.price || 0;
  const quantity = props.quantity || 1;
  const onQuantityChange = props.onQuantityChange || (() => {});
  const onRemove = props.onRemove || (() => {});
  const updating = props.updating || false;
  const removing = props.removing || false;

  // Handle decrease quantity
  const handleDecrease = () => {
    if (quantity > 1 && !updating) {
      onQuantityChange(quantity - 1);
    }
  };
  // Handle increase quantity
  const handleIncrease = () => {
    if (!updating) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow border border-gray-200 mb-2 min-h-[64px]">
      <img src={image} alt={name} className="w-12 h-12 object-cover rounded-md border" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-zinc-800 truncate mb-0.5">{name}</div>
        <div className="text-blue-700 font-semibold text-xs mb-1">{price.toLocaleString('vi-VN')}</div>
        <div className="flex items-center gap-2 text-xs">
          <button 
            onClick={handleDecrease} 
            className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={updating || quantity <= 1}
          >
            <FaMinus size={12} className="text-gray-600" />
          </button>
          <span className="px-3 py-1 text-sm font-bold bg-blue-50 border border-blue-200 rounded-lg min-w-[32px] text-center text-blue-800 mx-1 select-none">
            {updating ? <span className='inline-block w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin'></span> : quantity}
          </span>
          <button 
            onClick={handleIncrease} 
            className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={updating}
          >
            <FaPlus size={12} className="text-gray-600" />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 min-w-[80px]">
        <div className="flex items-center gap-2">
          <span className="text-zinc-700 font-medium text-xs">{(price * quantity).toLocaleString('vi-VN')}</span>
          <button 
            onClick={onRemove} 
            className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={removing}
          >
            {removing ? <span className='inline-block w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin'></span> : <FaTrash size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
