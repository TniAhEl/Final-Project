const SignUpLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen min-h-[600px] min-w-[900px] bg-white flex">
      {/* Nửa trái */}
      <div className="w-2/3 h-full bg-sky-100 flex items-center justify-center">
        {/* Bạn có thể thêm logo hoặc hình ảnh ở đây nếu muốn */}
        <div className="w-full max-w-md">{children}</div>
      </div>
      {/* Nửa phải: children (form) */}
      <div className="w-1/3 h-full flex items-center justify-center"></div>
    </div>
  );
};

export default SignUpLayout;
