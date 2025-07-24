import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="self-stretch p-20 border-b border-slate-200 inline-flex justify-start items-center gap-20">
      <div className="flex-1 self-stretch inline-flex flex-col justify-center items-start gap-6">
        <div className="self-stretch flex flex-col justify-start items-start gap-6">
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch justify-start text-slate-900 text-7xl font-extrabold font-['Roboto'] leading-[79.20px]">
              Buying Things just got easier
            </div>
          </div>
          <div className="self-stretch justify-start text-slate-900 text-base font-normal font-['Roboto'] leading-[28.80px]">
            Aliquam vel platea curabitur sit vestibulum egestas sit id lorem.
            Aliquet neque, dui sed eget scelerisque. Non at at venenatis tortor
            amet feugiat ullamcorper in. Odio vulputate cras vel lacinia turpis
            volutpat adipiscing. Sollicitudin at velit, blandit tempus nunc in.
          </div>
          <div className="inline-flex justify-start items-center gap-4 mt-4">
            <button
              className="px-6 py-3 bg-blue-600 rounded-lg text-white text-lg font-bold font-['Roboto'] leading-normal tracking-wide shadow hover:bg-blue-700 transition"
              onClick={() => navigate("/products")}
            >
              Buy now!
            </button>
            <button
              className="flex items-center px-4 py-3 rounded-lg text-blue-600 text-base font-medium font-['Roboto'] leading-normal tracking-wide hover:bg-blue-50 transition"
              onClick={() => navigate("/about-us")}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <polygon points="6,4 16,10 6,16" fill="#2563eb" />
              </svg>
              More Information
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 h-[627.87px] relative">
        <div className="size-[550px] left-[29px] top-[39px] absolute rounded-full border-[3px] border-slate-600" />
        <div className="size-[468px] left-[70px] top-[80px] absolute bg-blue-100 rounded-full blur-[75px]" />
        <div className="size-6 left-[517px] top-[147px] absolute bg-red-500" />
        <div className="size-3.5 left-[477px] top-[512px] absolute bg-blue-600 rounded-full" />
        <div className="size-6 left-[22px] top-[266px] absolute bg-yellow-500 rounded-full" />
        <div className="w-[308px] h-[627px] left-[146px] top-0 absolute flex items-center justify-center">
          <div className="absolute w-[280.73px] h-[602.88px] border-[8px] border-slate-900 rounded-[60px] bg-white"></div>
          <div className="absolute w-[264.73px] h-[586.88px] bg-blue-100 rounded-[52px] z-10 overflow-hidden flex flex-col">
            <div className="w-[280.73px] h-[602.88px] left-0 top-0 absolute bg-blue-100" />
            <div className="w-[229.40px] h-[157.55px] left-[25.67px] top-[402.73px] absolute bg-white" />
            <div className="w-[229.40px] h-[157.55px] left-[25.67px] top-[402.73px] absolute bg-white" />
            <div className="w-[31.28px] h-[31.35px] left-[166.83px] top-[439.70px] absolute bg-yellow-400" />
            <div className="w-[130.74px] h-[131.03px] left-[14.44px] top-[367.36px] absolute bg-white" />
            <div className="w-[130.74px] h-[131.03px] left-[14.44px] top-[367.36px] absolute bg-blue-100" />
            <div className="w-[141.17px] h-[135.05px] left-[255.06px] top-[580.38px] absolute origin-top-left -rotate-180 bg-blue-200" />
            <div className="w-[125.12px] h-[9.65px] left-[25.67px] top-[367.36px] absolute bg-white" />
            <div className="w-[280.73px] h-[77.17px] left-0 top-[525.72px] absolute bg-blue-100 border-t-[3px] border-white">
              <div className="w-[38.50px] h-[38.58px] left-[25.67px] top-[19.29px] absolute overflow-hidden">
                <div className="w-[28.88px] h-[31.35px] left-[2.41px] top-[3.62px] absolute bg-white" />
                <div className="w-[7.22px] h-[7.23px] left-[28.88px] top-[20.50px] absolute bg-white" />
              </div>
              <div className="w-[38.50px] h-[38.58px] left-[121.11px] top-[19.29px] absolute overflow-hidden">
                <div className="w-[26.03px] h-[26.09px] left-[3.61px] top-[3.62px] absolute bg-white" />
                <div className="w-[10.66px] h-[10.68px] left-[24.23px] top-[24.29px] absolute bg-white" />
              </div>
              <div className="w-[38.50px] h-[38.58px] left-[216.56px] top-[19.29px] absolute overflow-hidden">
                <div className="w-[28.88px] h-[2.41px] left-[4.81px] top-[10.85px] absolute bg-white" />
                <div className="w-[28.88px] h-[2.41px] left-[4.81px] top-[18.09px] absolute bg-white" />
                <div className="w-[28.88px] h-[2.41px] left-[4.81px] top-[25.32px] absolute bg-white" />
              </div>
            </div>
            <div className="w-[38.50px] h-[38.58px] left-[25.67px] top-[61.90px] absolute overflow-hidden">
              <div className="w-[14.44px] h-[25.32px] left-[5.71px] top-[6.63px] absolute bg-white" />
              <div className="w-[25.57px] h-[3.62px] left-[7.22px] top-[17.48px] absolute bg-white" />
            </div>
            <div className="w-[105.88px] h-[12.86px] left-[87.43px] top-[74.76px] absolute bg-blue-200" />
            <div className="w-[77px] h-[9.65px] left-[25.67px] top-[139.07px] absolute bg-white" />
            <div className="w-[113.09px] h-[9.65px] left-[25.67px] top-[161.57px] absolute bg-white" />
            <div className="w-[89.83px] h-[9.65px] left-[115.50px] top-[139.07px] absolute bg-white" />
            <div className="w-[314.42px] h-[131.83px] left-[25.67px] top-[196.94px] absolute">
              <div className="w-[96.25px] h-[131.83px] left-0 top-0 absolute bg-white rounded-[20px] overflow-hidden">
                <div className="w-[119.83px] h-[120.80px] left-[-55.72px] top-[71.54px] absolute bg-yellow-400" />
                <div className="w-[43.51px] h-[43.86px] left-[36.64px] top-[17.70px] absolute bg-white" />
                <div className="w-[43.51px] h-[43.86px] left-[36.64px] top-[17.70px] absolute bg-blue-200" />
              </div>
              <div className="w-[96.25px] h-[131.83px] left-[109.08px] top-0 absolute bg-white rounded-[20px] overflow-hidden">
                <div className="w-[21.73px] h-[21.54px] left-[61.32px] top-[24.62px] absolute bg-yellow-400" />
                <div className="w-[44.24px] h-[43.86px] left-[21.73px] top-[72.33px] absolute bg-blue-200" />
                <div className="w-[44.24px] h-[43.86px] left-[21.73px] top-[72.33px] absolute bg-blue-200" />
              </div>
              <div className="w-[96.25px] h-[131.83px] left-[218.17px] top-0 absolute bg-white rounded-[20px] overflow-hidden">
                <div className="w-[43.51px] h-[43.86px] left-[47.32px] top-[35.40px] absolute bg-white" />
                <div className="w-[43.51px] h-[43.86px] left-[47.32px] top-[35.40px] absolute bg-blue-200" />
                <div className="w-[61.03px] h-[58.17px] left-[6.38px] top-[33.76px] absolute bg-white" />
                <div className="w-[61.03px] h-[58.17px] left-[6.38px] top-[33.76px] absolute bg-yellow-400" />
              </div>
            </div>
          </div>
          <div className="w-[299.98px] h-[622.18px] left-[4.01px] top-[2.41px] absolute bg-slate-900 rounded-[60px]" />
          <div className="w-[84.22px] h-[24.12px] left-[111.49px] top-[32.96px] absolute bg-slate-900" />
          <div className="w-[77px] h-[2.41px] left-[115.50px] top-[596.45px] absolute bg-slate-900" />
        </div>
      </div>
    </div>
  );
};

export default Main;
