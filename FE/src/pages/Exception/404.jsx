import { Link } from "react-router-dom";
// Giả sử bạn đã đặt ảnh 404.png vào thư mục public hoặc src/assets/images
import error404 from "../../assets/images/404.png";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <img
        src={error404}
        alt="404 Error"
        className="w-72 h-72 object-contain mb-6"
      />
      <h1 className="text-7xl font-bold text-violet-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
      >
        Go back to homepage
      </Link>
    </div>
  );
};

export default NotFound;
