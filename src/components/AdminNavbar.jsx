import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaTachometerAlt,
  FaBox,
  FaUsers,
  FaCut,
  FaSignOutAlt,
  FaBell,
  FaSearch,
  FaBars,
  FaTimes,
  FaPalette,
  FaTshirt,
  FaShoppingCart,
} from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../config/firebaseConfig";
import toast from "react-hot-toast";

const AdminNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth(app);

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Profile",
      path: "/admin-profile",
      icon: <FaUser />,
    },
    {
      name: "All Designs",
      path: "/admin-designs",
      icon: <FaPalette />,
    },
    {
      name: "All Fabrics",
      path: "/admin-fabrics",
      icon: <FaTshirt />,
    },
    {
      name: "All Orders",
      path: "/admin-orders",
      icon: <FaShoppingCart />,
    },
    {
      name: "All Customers",
      path: "/admin-customers",
      icon: <FaUsers />,
    },
    {
      name: "All Tailors",
      path: "/admin-tailors",
      icon: <FaCut />,
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Top Header Bar */}
      <div className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-white shadow-md z-30 flex items-center justify-between px-4 lg:px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? (
            <FaTimes className="text-2xl text-slate-800" />
          ) : (
            <FaBars className="text-2xl text-slate-800" />
          )}
        </button>

        <div className="flex items-center gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
            Welcome, Admin
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          {/* Search Bar - Hidden on small screens */}
          <div className="relative hidden lg:block">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-48 xl:w-64"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>

          {/* Search Icon for mobile */}
          <button className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <FaSearch className="text-lg text-slate-600" />
          </button>

          {/* Notification Icon */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <FaBell className="text-lg sm:text-xl text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
              A
            </div>
          </div>
        </div>
      </div>
      onClick={() => setIsSidebarOpen(false)}
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-35"
          onClick={toggleSidebar}
        ></div>
      )}
      {/* Sidebar - Responsive */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-sm text-slate-400 mt-1">Tailor Management</p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 group ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/50"
                          : "hover:bg-slate-700/50 hover:translate-x-1"
                      }`}
                    >
                      <span
                        className={`text-xl ${
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-white"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span
                        className={`font-medium ${
                          isActive
                            ? "text-white"
                            : "text-slate-300 group-hover:text-white"
                        }`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white transition-all duration-300 group border border-red-600/30 hover:border-red-600"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminNavbar;
