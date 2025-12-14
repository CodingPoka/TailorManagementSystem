import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <img
              src="/src/assets/navbarLogo/logo.png"
              alt="DorjiHub Logo"
              className="h-16 w-auto object-contain"
            />
            <p className="text-gray-400 leading-relaxed text-sm">
              Revolutionizing the tailoring industry by connecting customers,
              tailors, and excellence through seamless digital solutions.
            </p>
            {/* Social Media */}
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="bg-slate-700 hover:bg-amber-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <FaFacebookF className="text-white text-lg" />
              </a>
              <a
                href="#"
                className="bg-slate-700 hover:bg-amber-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <FaTwitter className="text-white text-lg" />
              </a>
              <a
                href="#"
                className="bg-slate-700 hover:bg-amber-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <FaInstagram className="text-white text-lg" />
              </a>
              <a
                href="#"
                className="bg-slate-700 hover:bg-amber-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <FaLinkedinIn className="text-white text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-amber-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/product"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/testimonial"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">
              Our Services
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-amber-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Custom Tailoring
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Alterations
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Design Consultation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Fabric Selection
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-amber-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Express Delivery
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-amber-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-amber-400 text-lg mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  4 Embankment Drive Road,
                  <br />
                  Sector 10, Uttara,
                  <br />
                  Dhaka-1230, Bangladesh
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhoneAlt className="text-amber-400 text-lg flex-shrink-0" />
                <a
                  href="tel:+8801234567890"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  +880 1234-567890
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-amber-400 text-lg flex-shrink-0" />
                <a
                  href="mailto:info@dorjihub.com"
                  className="text-gray-400 hover:text-amber-400 transition-colors duration-300 text-sm"
                >
                  info@dorjihub.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            <p className="text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} DorjiHub. All rights reserved.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="text-gray-400">Developed with</span>
              <FaHeart className="text-red-500 animate-pulse text-base" />
              <span className="text-gray-400">by</span>
              <a
                href="https://github.com/hajongKingshuk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-300"
              >
                hajongKingshuk
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
