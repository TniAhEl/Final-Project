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
              <li>About Lift</li>
              <li>Press Releases</li>
              <li>Environment</li>
              <li>Jobs</li>
              <li>Privacy Policy</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Tickets & Booking */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tickets & Booking</h3>
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
                <span className="opacity-70"> Reservation: </span>123-456-7890
              </li>
              <li>
                <span className="opacity-70">Ticket Office: </span>123-456-7890
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Social</h3>
            <div className="flex gap-4 mt-2">
              <FaFacebook size={20} />
              <FaTwitter size={20} />
              <FaInstagram size={20} />
              <FaYoutube size={20} />
              <FaTiktok size={20} />
              <FaTelegram size={20} />
            </div>
          </div>
        </div>

        <hr className="my-10 border-white/20" />

        <p className="text-center text-sm opacity-75">
          © 2019 Lift Media | All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
