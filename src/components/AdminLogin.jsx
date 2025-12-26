import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaHome,
} from "react-icons/fa";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../config/firebaseConfig";
import toast from "react-hot-toast";

const AdminLogin = () => {
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

        toast.success("Login successful! Welcome Admin.", {
          duration: 3000,
          position: "top-center",
        });

        // Redirect to Admin Dashboard
        navigate("/admin-dashboard");
      } catch (error) {
        console.error("Login error:", error);
        let errorMessage = "Login failed. Please try again.";

        if (error.code === "auth/user-not-found") {
          errorMessage = "No admin account found with this email.";
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
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-6xl w-full">
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-red-500/20">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Login Form */}
            <div className="p-8 sm:p-12 lg:p-16">
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <Link
                  to="/"
                  className="inline-flex items-center text-gray-400 hover:text-red-400 transition-colors duration-200 mb-4 text-sm group"
                >
                  <FaHome className="mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Back to Home
                </Link>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Admin Login
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  Secure access to the admin dashboard
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
                    Admin Email
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
                          : "border-slate-600 focus:border-red-500"
                      } text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 placeholder-gray-500`}
                      placeholder="Enter admin email"
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
                          : "border-slate-600 focus:border-red-500"
                      } text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all duration-300 placeholder-gray-500`}
                      placeholder="Enter admin password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-400 transition-colors duration-200"
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
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-red-500 focus:ring-red-500 focus:ring-offset-slate-800 cursor-pointer"
                    />
                    <span className="ml-2 text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-bold py-3.5 rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? "Signing In..." : "Sign In as Admin"}
                </button>

                {/* Register Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-400 text-sm">
                    Don't have an admin account?{" "}
                    <Link
                      to="/admin-register"
                      className="text-red-400 hover:text-red-300 font-semibold transition-colors duration-200"
                    >
                      Register Here
                    </Link>
                  </p>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-start">
                    <FaShieldAlt className="text-red-400 text-lg mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-300 font-semibold text-sm mb-1">
                        Secure Access
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        This is a protected area. All login attempts are
                        monitored and logged for security purposes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Other Login Options */}
                <div className="text-center mt-6 space-y-2">
                  <p className="text-gray-500 text-xs">Login as:</p>
                  <div className="flex justify-center gap-4 text-sm">
                    <Link
                      to="/login"
                      className="text-gray-400 hover:text-amber-400 transition-colors duration-200"
                    >
                      Customer
                    </Link>
                    <span className="text-gray-600">|</span>
                    <Link
                      to="/tailor-login"
                      className="text-gray-400 hover:text-amber-400 transition-colors duration-200"
                    >
                      Tailor
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Side - Image/Info */}
            <div className="hidden md:block relative bg-gradient-to-br from-red-500/20 to-red-600/20 p-12">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMzksMTY4LDE2OCwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

              <div className="relative h-full flex flex-col justify-center items-center text-center space-y-8">
                {/* Logo */}
                <div className="relative">
                  <div className="absolute inset-0 bg-red-400 blur-2xl opacity-30 rounded-full animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl shadow-2xl border border-red-500/30">
                    <img
                      src="/assets/navbarLogo/logo.png"
                      alt="DorjiHub"
                      className="h-32 w-auto object-contain"
                    />
                  </div>
                </div>

                {/* Welcome Text */}
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">
                    Admin Dashboard
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                    Manage the entire DorjiHub platform. Control users, monitor
                    orders, and ensure smooth operations.
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 text-left w-full max-w-sm">
                  <div className="flex items-start space-x-3 bg-slate-700/30 p-4 rounded-xl backdrop-blur-sm border border-red-500/20">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mt-0.5">
                      <span className="text-red-400 text-xl">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        User Management
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Manage customers, tailors, and their permissions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-slate-700/30 p-4 rounded-xl backdrop-blur-sm border border-red-500/20">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mt-0.5">
                      <span className="text-red-400 text-xl">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        Platform Analytics
                      </h4>
                      <p className="text-gray-400 text-sm">
                        View comprehensive reports and system statistics
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-slate-700/30 p-4 rounded-xl backdrop-blur-sm border border-red-500/20">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mt-0.5">
                      <span className="text-red-400 text-xl">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">
                        System Control
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Configure settings and maintain platform security
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
          <p>© 2024 DorjiHub. All rights reserved. | Admin Portal</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
