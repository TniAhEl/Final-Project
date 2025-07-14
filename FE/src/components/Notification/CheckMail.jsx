import React from 'react';

const CheckMail = ({ onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10">
    <div className="w-full max-w-sm px-8 py-8 bg-white rounded-2xl shadow-2xl relative flex flex-col items-center">
      {/* Nút đóng */}
      <button
        className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        onClick={onClose}
        aria-label="Close"
        type="button"
      >
        <span className="block w-4 h-0.5 bg-gray-400 rotate-45 absolute"></span>
        <span className="block w-4 h-0.5 bg-gray-400 -rotate-45 absolute"></span>
      </button>
      {/* Icon mail */}
      <div className="flex items-center justify-center mb-6 mt-2">
        <div className="p-4 bg-gray-100 rounded-2xl flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#6366F1"/>
            <path d="M8 12L16 18L24 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="8" y="12" width="16" height="8" rx="2" stroke="#fff" strokeWidth="2"/>
          </svg>
        </div>
      </div>
      {/* Text */}
      <div className="w-full flex flex-col items-center gap-2">
        <div className="text-center text-gray-900 text-2xl font-bold font-['Inter'] leading-tight">Check Your Email</div>
        <div className="text-center text-gray-500 text-base font-medium font-['Inter'] leading-snug">We have just sent to <span className="text-indigo-600 font-semibold">Info@Flexui.io</span> instructions to reset password</div>
      </div>
    </div>
  </div>
);

export default CheckMail;
