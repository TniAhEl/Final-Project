import React from 'react';

const statusColor = {
  Processing: 'text-green-500',
  Deferred: 'text-red-500 font-bold',
  Paused: 'text-neutral-600',
};

const defaultColumns = [
  { key: 'number', label: 'Number', width: 'w-32' },
  { key: 'office', label: 'Office', width: 'w-56' },
  { key: 'date', label: 'Date', width: 'w-20' },
  { key: 'time', label: 'Time', width: 'w-12' },
  { key: 'customer', label: 'Customer', width: 'w-44' },
  { key: 'step', label: 'Step', width: 'w-20' },
  { key: 'product', label: 'Product', width: 'w-40' },
  { key: 'clientType', label: 'Client', width: 'w-32' },
  { key: 'code', label: 'Code', width: 'w-16' },
  { key: 'manager', label: 'Manager', width: 'w-44' },
  { key: 'duration', label: 'Duration', width: 'w-28' },
  { key: 'status', label: 'Status', width: 'w-32' },
];

const OrderTable = ({
  orders = [],
  columns = defaultColumns,
  onView = () => {},
  onDelete = () => {},
  showActions = true,
}) => {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-slate-300 bg-white font-['Roboto']">
      <div className="divide-y divide-slate-300">
        {/* Header */}
        <div className="flex bg-neutral-50">
          {columns.map(col => (
            <div key={col.key} className={`${col.width} p-6 text-slate-800/90 text-sm font-normal`}>
              {col.label}
            </div>
          ))}
          {showActions && (
            <div className="w-32 p-6 text-slate-800/90 text-sm font-normal">Actions</div>
          )}
        </div>
        {/* Rows */}
        {orders.map((order, idx) => (
          <div key={order.number + idx} className="flex items-center bg-white hover:bg-blue-50/50 divide-x divide-slate-300">
            {columns.map(col => (
              <div key={col.key} className={`${col.width} p-6 text-zinc-800 text-sm font-normal`}>
                {col.key === 'status' ? (
                  <span className={statusColor[order.status] || 'text-neutral-600'}>
                    {order.status}
                  </span>
                ) : (
                  order[col.key]
                )}
              </div>
            ))}
            {showActions && (
              <div className="w-32 p-6 flex gap-2">
                <button onClick={() => onView(order)} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs font-medium">View</button>
                <button onClick={() => onDelete(order)} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs font-medium">Delete</button>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && (
          <div className="p-6 text-center text-gray-400">Không có đơn hàng nào.</div>
        )}
      </div>
    </div>
  );
};

export default OrderTable;
