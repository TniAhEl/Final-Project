import AuthenticationImg from "../assets/images/Authen.png";

const SignInLayout = ({ children }) => {
  return (
    <div className="w-screen h-screen min-h-[600px] min-w-[900px] bg-white flex">
      {/* Half left: contains form */}
      <div className="w-2/3 h-full bg-sky-100 flex items-center justify-center">
        <img src={AuthenticationImg} alt="Authentication" />
      </div>

      {/* Half right: empty or decorative */}
      <div className="w-1/3 h-full flex items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default SignInLayout;
