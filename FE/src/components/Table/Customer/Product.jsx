import React from 'react';

const statusColor = {
  Active: 'text-green-500',
  Inactive: 'text-neutral-600',
  OutOfStock: 'text-red-500 font-bold',
};

const ProductTable = ({
  products = [
    { productId: 'P001', name: 'iPhone 15 Pro', category: ['Phone', 'Flagship'], price: 999, stock: 10, status: 'Active', rating: 4.5, url: 'https://apple.com' },
    { productId: 'P002', name: 'AirPods Pro', category: ['Accessories'], price: 199, stock: 0, status: 'OutOfStock', rating: 4, url: 'https://apple.com' },
    { productId: 'P003', name: 'Apple Watch', category: ['Watch', 'Wearable'], price: 399, stock: 5, status: 'Inactive', rating: 5, url: 'https://apple.com' },
  ],
  onView = () => {},
  onDelete = () => {},
}) => {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto']">
      <div className="divide-y divide-slate-300">
        {/* Header */}
        <div className="flex bg-neutral-50">
          <div className="w-32 p-6 text-slate-800/90 text-sm font-normal">ID</div>
          <div className="w-56 p-6 text-slate-800/90 text-sm font-normal">Name</div>
          <div className="flex-1 p-6 text-slate-800/90 text-sm font-normal">Category</div>
          <div className="w-40 p-6 text-slate-800/90 text-sm font-normal">Price</div>
          <div className="w-32 p-6 text-slate-800/90 text-sm font-normal">Stock</div>
          <div className="w-40 p-6 text-slate-800/90 text-sm font-normal">Status</div>
          <div className="w-40 p-6 text-slate-800/90 text-sm font-normal">Rating</div>
          <div className="flex-1 p-6 text-slate-800/90 text-sm font-normal">URL</div>
          <div className="w-40 p-6 text-slate-800/90 text-sm font-normal">Actions</div>
        </div>
        {/* Rows */}
        {products.map((product, idx) => (
          <div key={product.productId} className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300">
            <div className="w-32 p-6 text-zinc-800 text-sm font-normal">{product.productId}</div>
            <div className="w-56 p-6 text-zinc-800 text-sm font-normal">{product.name}</div>
            <div className="flex-1 p-6 flex gap-2">
              {product.category.map((cat, i) => (
                <span key={i} className="px-3 py-1 bg-emerald-100 rounded-md text-neutral-800 text-base font-medium">{cat}</span>
              ))}
            </div>
            <div className="w-40 p-6 font-semibold text-blue-700">${product.price.toLocaleString()}</div>
            <div className="w-32 p-6 text-zinc-800 text-sm font-normal">{product.stock}</div>
            <div className={`w-40 p-6 text-sm font-normal ${statusColor[product.status] || 'text-neutral-600'}`}>{product.status}</div>
            <div className="w-40 p-6 flex items-center">
              <span className="h-[30px] px-3 py-1.5 bg-yellow-100 rounded-md flex items-center gap-1">
                {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
                {product.rating % 1 !== 0 && <span className="text-amber-400 text-lg">½</span>}
              </span>
            </div>
            <div className="flex-1 p-6">
              <a href={product.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{product.url}</a>
            </div>
            <div className="w-40 p-6 flex gap-2">
              <button onClick={() => onView(product)} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium">View</button>
              <button onClick={() => onDelete(product)} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTable;
