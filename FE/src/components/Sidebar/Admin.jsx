import { MdSpaceDashboard, MdInventory2, MdShoppingCart, MdLocalOffer, MdBarChart, MdVerifiedUser } from 'react-icons/md';
import { FaUsers, FaShieldAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const menu = [
  {
    type: 'item',
    label: 'Dashboard',
    icon: <MdSpaceDashboard className="text-xl text-gray-700" />,
    to: '/admin/dashboard',
  },
  { type: 'section', label: 'Sales', className: 'text-slate-600' },
  {
    type: 'item',
    label: 'Products',
    icon: <MdInventory2 className="text-xl text-gray-700" />,
    to: '/admin/products',
  },
  {
    type: 'item',
    label: 'Orders',
    icon: <MdShoppingCart className="text-xl text-gray-700" />,
    to: '/admin/orders',
  },
  {
    type: 'item',
    label: 'Users',
    icon: <FaUsers className="text-xl text-gray-700" />,
    to: '/admin/users',
  },
  {
    type: 'item',
    label: 'Warranty',
    icon: <MdVerifiedUser className="text-xl text-gray-700" />,
    to: '/admin/warranties',
  },
  {
    type: 'item',
    label: 'Insurance',
    icon: <FaShieldAlt className="text-xl text-gray-700" />,
    to: '/admin/insurances',
  },
  { type: 'section', label: 'Purchase', className: 'text-slate-600' },
  {
    type: 'item',
    label: 'Promotions',
    icon: <MdLocalOffer className="text-xl text-gray-700" />,
    to: '/admin/promotions',
  },
  {
    type: 'item',
    label: 'Reports',
    icon: <MdBarChart className="text-xl text-gray-700" />,
    to: '/admin/reports',
  },
];

const SidebarAdmin = () => {
  const location = useLocation();

  return (
    <div className="w-full h-full overflow-y-auto self-stretch p-3 bg-slate-100 inline-flex flex-col justify-start items-start gap-2 overflow-hidden">
      {menu.map((item, idx) =>
        item.type === 'section' ? (
          <div
            key={idx}
            className={`self-stretch justify-start text-xs font-light font-['Inter'] leading-none ${item.className}`}
          >
            {item.label}
          </div>
        ) : (
          <Link
            to={item.to}
            key={idx}
            className={`self-stretch px-2 py-1 rounded-sm inline-flex justify-start items-center gap-2 hover:bg-slate-200 transition ${
              location.pathname === item.to ? 'bg-slate-300' : ''
            }`}
          >
            <div className="size-6 flex items-center justify-center">
              {item.icon}
            </div>
            <div className="justify-start text-gray-700 text-sm font-normal font-['Inter']">
              {item.label}
            </div>
          </Link>
        )
      )}
    </div>
  );
};

export default SidebarAdmin;
