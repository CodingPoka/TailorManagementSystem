import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCut,
  FaHome,
} from "react-icons/fa";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../config/firebaseConfig";
import toast from "react-hot-toast";

const TailorLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        toast.success("Login successful! Welcome back.", {
          duration: 3000,
          position: "top-center",
        });

        // Redirect to Tailor Dashboard
        navigate("/tailor-dashboard");
      } catch (error) {
        console.error("Login error:", error);
        let errorMessage = "Login failed. Please try again.";

        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email format.";
        } else if (error.code === "auth/invalid-credential") {
          errorMessage =
            "Invalid credentials. Please check your email and password.";
        }

        toast.error(errorMessage, {
          duration: 4000,
          position: "top-center",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-6xl w-full">
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-amber-500/20">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Login Form */}
            <div className="p-8 sm:p-12 lg:p-16">
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <Link
                  to="/"
                  className="inline-flex items-center text-gray-400 hover:text-amber-400 transition-colors duration-200 mb-4 text-sm group"
                >
                  <FaHome className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Back to Home
                </Link>
                <div className="flex justify-center mb-6">
                  <img
                    src="/assets/navbarLogo/logo.png"
                    alt="DorjiHub Logo"
                    className="h-24 w-auto object-contain transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Tailor Login
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  Welcome back! Please login to your account
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 bg-slate-700/50 border ${
                        errors.email
                          ? "border-red-500"
                          : "border-slate-600 focus:border-amber-500"
                      } text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300 placeholder-gray-500`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <span className="mr-1">⚠</span> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 text-lg" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-12 py-3.5 bg-slate-700/50 border ${
                        errors.password
                          ? "border-red-500"
                          : "border-slate-600 focus:border-amber-500"
                      } text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300 placeholder-gray-500`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-400 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <FaEyeSlash className="text-xl" />
                      ) : (
                        <FaEye className="text-xl" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <span className="mr-1">⚠</span> {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-800 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-amber-400 hover:text-amber-300 font-medium transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3.5 rounded-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-800/40 text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-gray-300 hover:bg-slate-700 hover:border-amber-500 transition-all duration-300 transform hover:scale-105"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-gray-300 hover:bg-slate-700 hover:border-amber-500 transition-all duration-300 transform hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>

                {/* Register Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-400 text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/tailor-register"
                      className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-200"
                    >
                      Register as Tailor
                    </Link>
                  </p>
                </div>

                {/* Other Login Options */}
                <div className="text-center mt-4 space-y-2">
                  <p className="text-gray-500 text-xs">Login as:</p>
                  <div className="flex justify-center gap-4 text-sm">
                    <Link
                      to="/customer-login"
                      className="text-gray-400 hover:text-amber-400 transition-colors duration-200"
                    >
                      Customer
                    </Link>
                    <span className="text-gray-600">|</span>
                    <Link
                      to="/admin-login"
                      className="text-gray-400 hover:text-amber-400 transition-colors duration-200"
                    >
                      Admin
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Side - Image/Info */}
            <div className="hidden md:block relative bg-gradient-to-br from-amber-500/20 to-amber-600/20 p-12">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTEsMTkxLDM2LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

              <div className="relative h-full flex flex-col justify-center items-center text-center space-y-8">
                {/* Animated Scissors Icon */}
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-30 rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 p-8 rounded-3xl shadow-2xl transform hover:rotate-12 transition-transform duration-500">
                    <FaCut className="text-white text-6xl transform -rotate-45" />
                  </div>
                </div>

                {/* Welcome Text */}
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">
                    Welcome to DorjiHub
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                    Manage your tailoring business efficiently. Track orders,
                    communicate with customers, and grow your business.
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 text-left w-full max-w-sm">
                  <div className="flex items-start space-x-3 bg-slate-700/30 p-4 rounded-xl backdrop-blur-sm border border-amber-500/20">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center mt-0.5">
                      <span className="text-amber-400 text-xl">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        Order Management
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Track and manage all your customer orders in one place
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-slate-700/30 p-4 rounded-xl backdrop-blur-sm border border-amber-500/20">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center mt-0.5">
                      <span className="text-amber-400 text-xl">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        Customer Communication
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Stay connected with your customers seamlessly
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-slate-700/30 p-4 rounded-xl backdrop-blur-sm border border-amber-500/20">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center mt-0.5">
                      <span className="text-amber-400 text-xl">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        Business Analytics
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Get insights to grow your tailoring business
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            © 2024 DorjiHub. All rights reserved. | Crafted with care for
            tailors
          </p>
        </div>
      </div>
    </div>
  );
};

export default TailorLogin;
