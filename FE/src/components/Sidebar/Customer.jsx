import {
  MdShoppingCart,
  MdPerson,
  MdAssignment,
  MdVerifiedUser,
  MdLogout,
  MdDashboard,
} from "react-icons/md";
import { FaClipboardList, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const menu = [
  {
    label: "Dashboard",
    icon: <MdDashboard className="text-xl text-gray-700" />,
    to: "/customer/dashboard",
  },
  {
    label: "My Orders",
    icon: <FaClipboardList className="text-xl text-gray-700" />,
    to: "/customer/orders",
  },
  {
    label: "My Cart",
    icon: <MdShoppingCart className="text-xl text-gray-700" />,
    to: "/customer/cart",
  },
  {
    label: "My Profile",
    icon: <MdPerson className="text-xl text-gray-700" />,
    to: "/customer/profile",
  },
  {
    label: "My Order Warranty",
    icon: <MdVerifiedUser className="text-xl text-gray-700" />,
    to: "/customer/warranty",
  },
  {
    label: "My Order Insurance",
    icon: <FaShieldAlt className="text-xl text-gray-700" />,
    to: "/customer/insurance",
  },
  {
    label: "Logout",
    icon: <MdLogout className="text-xl text-gray-700" />,
    to: "/signin",
  },
];

const SidebarCustomer = () => {
  return (
    <div className="w-[220px] h-full overflow-y-auto self-stretch p-3 bg-slate-100 inline-flex flex-col justify-start items-start gap-2">
      {menu.map((item, idx) => (
        <Link
          to={item.to}
          key={idx}
          className="self-stretch px-2 py-1 rounded-sm inline-flex justify-start items-center gap-2 hover:bg-slate-200 transition"
        >
          <div className="size-6 flex items-center justify-center">
            {item.icon}
          </div>
          <div className="justify-start text-gray-700 text-sm font-normal font-['Inter']">
            {item.label}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SidebarCustomer;
