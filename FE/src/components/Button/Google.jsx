import { FaGoogle } from 'react-icons/fa';

const GoogleIcon = () => (
  <span className="size-5 relative inline-block overflow-hidden">
    <span className="w-[9.61px] h-[9.39px] left-[10.20px] top-[8.20px] absolute bg-blue-500 rounded-sm" />
    <span className="w-[15.56px] h-[8.08px] left-[1.26px] top-[11.92px] absolute bg-green-600 rounded-sm" />
    <span className="w-[4.39px] h-[8.98px] left-[0.20px] top-[5.51px] absolute bg-yellow-500 rounded-sm" />
    <span className="w-[15.63px] h-[8.09px] left-[1.26px] top-0 absolute bg-red-500 rounded-sm" />
  </span>
);

const GoogleButton = ({ children, ...props }) => (
  <button
    className="px-[45px] py-4 rounded-lg outline outline-1 outline-offset-[-1px] outline-gray-600 inline-flex justify-center items-center gap-2.5 font-['Open_Sans']"
    {...props}
  >
    <span className="flex items-center gap-[15px]">
      <FaGoogle />
      <span className="text-slate-800 text-xs font-semibold leading-none">{children || 'Sign in with Google'}</span>
    </span>
  </button>
);

export default GoogleButton;
