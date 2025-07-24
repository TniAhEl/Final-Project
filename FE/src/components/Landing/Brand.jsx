import React, { useEffect, useState } from "react";
import { FaApple } from "react-icons/fa";
import {
  SiSamsung,
  SiXiaomi,
  SiOppo,
  SiVivo,
  SiNokia,
  SiSony,
  SiAsus,
  SiHuawei,
} from "react-icons/si";
import { Link, useNavigate } from "react-router-dom";
import { getAllBrands } from "../../api/productService";

// Map brand name to icon
const brandIconMap = {
  Apple: <FaApple className="text-4xl text-black" />,
  Samsung: <SiSamsung className="text-4xl text-blue-500" />,
  Xiaomi: <SiXiaomi className="text-4xl text-orange-500" />,
  Oppo: <SiOppo className="text-4xl text-green-500" />,
  Vivo: <SiVivo className="text-4xl text-sky-500" />,
  Nokia: <SiNokia className="text-4xl text-blue-800" />,
  Sony: <SiSony className="text-4xl text-gray-800" />,
  Asus: <SiAsus className="text-4xl text-indigo-700" />,
  Huawei: <SiHuawei className="text-4xl text-red-600" />,
};

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllBrands()
      .then((data) => {
        // Nếu data là mảng string, chuyển thành mảng object { name }
        if (Array.isArray(data) && typeof data[0] === "string") {
          setBrands(data.map((name) => ({ name })));
          console.log(
            "Brands set:",
            data.map((name) => ({ name }))
          );
        } else {
          setBrands(data);
          console.log("Brands set:", data);
        }
      })
      .catch(() => {
        setBrands([]);
        console.log("Brands set: [] (error)");
      });
  }, []);

  const handleBrandClick = (brandName) => {
    // Chuyển sang trang category, truyền filter qua state với key 'brands'
    navigate("/products", { state: { filter: { brand: [brandName] } } });
  };

  return (
    <div className="self-stretch p-20 bg-white flex flex-col justify-center items-center gap-20">
      <div className="self-stretch flex flex-col justify-center items-center gap-8">
        <div className="self-stretch flex flex-col justify-center items-center gap-2">
          <div className="self-stretch text-center text-slate-900 text-[56px] font-extrabold font-['Roboto'] leading-[61.60px]">
            Our Top Partners
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-x-24 gap-y-10 w-full mt-10">
        {brands.map((brand) => {
          const icon = brandIconMap[brand.name] || (
            <div className="text-4xl text-gray-400">?</div>
          );
          return (
            <button
              type="button"
              key={brand.name}
              className="flex flex-col items-center gap-2 min-w-[120px] group bg-transparent border-0 cursor-pointer"
              onClick={() => handleBrandClick(brand.name)}
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 shadow group-hover:scale-110 transition-transform">
                {icon}
              </div>
              <span className="text-slate-900 text-xl font-bold font-['Roboto'] leading-relaxed group-hover:text-violet-600 transition-colors">
                {brand.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Brand;
