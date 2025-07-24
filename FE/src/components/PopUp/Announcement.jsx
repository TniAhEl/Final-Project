import React from "react";
import { FaInstagram, FaFacebook, FaDribbble } from "react-icons/fa";
import SubmitButton from "../Button/Submit";

const Announcement = () => (
  <div className="w-full min-h-[560px] flex items-center justify-center bg-gray-100 py-10">
    <div className="w-full max-w-md rounded-3xl shadow-2xl bg-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-neutral-400 px-8 pt-10 pb-8 rounded-t-3xl">
        <h2 className="text-zinc-800 text-3xl font-semibold font-['Inter']">
          Try using our templates!
        </h2>
      </div>
      {/* Form */}
      <form className="flex flex-col gap-6 px-8 py-10">
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full px-4 py-3 bg-neutral-100 rounded-md text-base font-normal font-['Inter'] text-neutral-700 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-neutral-400 transition"
        />
        <input
          type="email"
          placeholder="Enter your email address"
          className="w-full px-4 py-3 bg-neutral-100 rounded-md text-base font-normal font-['Inter'] text-neutral-700 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-neutral-400 transition"
        />
        <SubmitButton className="w-full h-[51px] text-lg font-medium font-['Inter'] bg-neutral-700 hover:bg-neutral-800 rounded-md">
          Send
        </SubmitButton>
        <div className="flex justify-center items-center gap-6 mt-2">
          <a
            href="#"
            aria-label="Instagram"
            className="text-neutral-700 hover:text-pink-500 transition text-2xl"
          >
            <FaInstagram />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="text-neutral-700 hover:text-blue-600 transition text-2xl"
          >
            <FaFacebook />
          </a>
          <a
            href="#"
            aria-label="Dribbble"
            className="text-neutral-700 hover:text-pink-400 transition text-2xl"
          >
            <FaDribbble />
          </a>
        </div>
      </form>
    </div>
  </div>
);

export default Announcement;
