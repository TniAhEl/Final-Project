import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaTelegram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Learn More */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Learn More</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/about-us" className="hover:underline">About Us</a></li>
              <li><a href="/jobs" className="hover:underline">Jobs</a></li>
              <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:underline">Term of services </a></li>
            </ul>
          </div>

          {/* Tickets & Booking */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Lift Tickets</li>
              <li>Season Passes</li>
              <li>Vacation Packages</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="text-sm text-white/80 space-y-2">
              <li>
                <span className="opacity-70"> Hotline: </span>
                <a href="tel:1234567890" className="hover:underline">123-456-7890</a>
              </li>
              <li>
                <span className="opacity-70">Head Office: </span>
                <a href="tel:1234567890" className="hover:underline">123-456-7890</a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Social</h3>
            <div className="flex gap-4 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram size={20} /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube size={20} /></a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok size={20} /></a>
            </div>
          </div>
        </div>

        <hr className="my-10 border-white/20" />

        <p className="text-center text-sm opacity-75">
          © 2025 E-Shop | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
