import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaUser,
  FaTachometerAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Design", path: "/design" },
    { name: "Fabrics", path: "/fabrics" },
    { name: "About Us", path: "/about" },
    { name: "Testimonial", path: "/testimonial" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl sticky top-0 z-50 border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/src/assets/navbarLogo/logo.png"
              alt="Logo"
              className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-200 hover:text-amber-400 font-semibold text-lg px-3 py-2 rounded-lg transition-all duration-300 relative group whitespace-nowrap"
              >
                {item.name}
                <span className="absolute bottom-1 left-3 w-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300 group-hover:w-[calc(100%-1.5rem)] rounded-full"></span>
              </Link>
            ))}
          </div>

          {/* Cart and Login/Profile Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/cart"
              className="relative text-gray-200 hover:text-amber-400 transition-all duration-300 transform hover:scale-110 group"
            >
              <FaShoppingCart className="text-2xl" />
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-110 transition-transform">
                {cartCount}
              </span>
            </Link>

            {user ? (
              // Logged in - Show Profile, Dashboard, Logout
              <>
                <Link
                  to="/customer-profile"
                  className="flex items-center gap-2 text-gray-200 hover:text-amber-400 font-semibold text-lg px-4 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <FaUser />
                  Profile
                </Link>
                <Link
                  to="/customer-dashboard"
                  className="flex items-center gap-2 text-gray-200 hover:text-amber-400 font-semibold text-lg px-4 py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  <FaTachometerAlt />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold text-lg px-6 py-2.5 rounded-lg border-2 border-amber-400 hover:border-amber-300 transition-all duration-300 transform hover:scale-105"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            ) : (
              // Not logged in - Show Login
              <Link
                to="/customer-login"
                className="text-amber-400 hover:text-amber-300 font-bold text-lg px-6 py-2.5 rounded-lg border-2 border-amber-400 hover:border-amber-300 transition-all duration-300 transform hover:scale-105"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-200 hover:text-amber-400 focus:outline-none transition-colors duration-300"
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2 bg-slate-800/95 backdrop-blur-lg border-t border-amber-500/20">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="block px-5 py-3 text-gray-200 hover:bg-amber-500/10 hover:text-amber-400 rounded-lg transition-all duration-200 font-semibold text-lg"
            >
              {item.name}
            </Link>
          ))}
          <Link
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 px-5 py-3 text-gray-200 hover:bg-amber-500/10 hover:text-amber-400 rounded-lg transition-all duration-200 font-semibold text-base"
          >
            <FaShoppingCart className="text-xl" />
            <span>Cart</span>
            <span className="ml-auto bg-amber-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>

          {user ? (
            // Logged in - Show Profile, Dashboard, Logout
            <>
              <Link
                to="/customer-profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-gray-200 hover:bg-amber-500/10 hover:text-amber-400 rounded-lg transition-all duration-200 font-semibold text-base"
              >
                <FaUser className="text-xl" />
                <span>Profile</span>
              </Link>
              <Link
                to="/customer-dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-gray-200 hover:bg-amber-500/10 hover:text-amber-400 rounded-lg transition-all duration-200 font-semibold text-base"
              >
                <FaTachometerAlt className="text-xl" />
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 text-amber-400 hover:text-amber-300 font-bold text-base px-6 py-3 rounded-lg border-2 border-amber-400 hover:border-amber-300 transition-all duration-200 mt-4 w-full"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            // Not logged in - Show Login
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center text-amber-400 hover:text-amber-300 font-bold text-base px-6 py-3 rounded-lg border-2 border-amber-400 hover:border-amber-300 transition-all duration-200 mt-4"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
