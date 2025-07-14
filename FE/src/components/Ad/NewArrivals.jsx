import ProductCard from '../Card/Product';
import { FiChevronDown } from 'react-icons/fi';

function NewArrivalsAd(props) {
  const {
    title = 'New Arrivals!',
    description = "Check out the latest products in our store. Don't miss out on the hottest trends!",
    products = [
      { image: 'https://placehold.co/120x120', name: 'iPhone 15 Pro', price: 899 },
      { image: 'https://placehold.co/120x120', name: 'AirPods Pro', price: 199 },
      { image: 'https://placehold.co/120x120', name: 'Apple Watch', price: 399 },
      { image: 'https://placehold.co/120x120', name: 'Google Pixel 8', price: 799 },
      { image: 'https://placehold.co/120x120', name: 'Samsung Tab S9', price: 999 },
     
    ],
    buttonText = 'Shop Now',
    onClick = () => {},
  } = props;

  return (
    <div className="flex flex-col bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl shadow p-6 gap-6  w-full mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 flex flex-col items-start gap-3">
          <h2 className="text-2xl font-bold text-blue-900">{title}</h2>
          <p className="text-zinc-700 text-base">{description}</p>
          <button onClick={onClick} className="mt-2 px-5 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition font-medium text-base">
            {buttonText}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mt-2">
        {products.map((product, idx) => (
          <div key={idx} className="w-full">
            <ProductCard
              image={product.image}
              name={product.name}
              price={product.price}
              className="w-full max-w-[200px] mx-auto"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center mt-4">
        <span className="text-blue-700 font-medium flex items-center gap-1 cursor-pointer hover:underline">
          More <FiChevronDown className="ml-1 text-xl" />
        </span>
      </div>
    </div>
  );
}

export default NewArrivalsAd;
