
import CartCard from '../Card/Cart';

const SidebarCart = ({ products = [], total = 0, onGoToCart = () => {} }) => {
  return (
    <aside className="w-[312px] px-4 py-6 bg-neutral-900 rounded-md outline outline-1 outline-offset-[-1px] outline-neutral-700 flex flex-col gap-6 font-['Inter'] text-neutral-100">
      <h2 className="text-xl font-bold mb-4">Cart</h2>
      <div className="flex-1 overflow-y-auto mb-4">
        {products.length === 0 ? (
          <div className="text-neutral-400 text-sm">Your cart is empty.</div>
        ) : (
          <div>
            {products.map((p, idx) => (
              <CartCard
                key={idx}
                image={p.image}
                name={p.name}
                price={p.price}
                quantity={p.quantity}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-auto">
        <div className="font-semibold text-base mb-2">Total: <span className="text-blue-400">${total.toFixed(2)}</span></div>
        <button onClick={onGoToCart} className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition font-medium">Go to Cart</button>
      </div>
    </aside>
  );
};

export default SidebarCart;
