import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaCut,
  FaHome,
} from "react-icons/fa";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { app, db } from "../config/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

const TailorRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{11}$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      newErrors.phone = "Please enter a valid 11-digit phone number";
    }

    if (!formData.experience.trim()) {
      newErrors.experience = "Experience is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Update user profile with name
        await updateProfile(userCredential.user, {
          displayName: formData.fullName,
        });

        // Save tailor data to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          experience: formData.experience,
          role: "tailor",
          createdAt: serverTimestamp(),
        });

        toast.success("Tailor registration successful! Please login.", {
          duration: 3000,
          position: "top-center",
        });

        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate("/tailor-login");
        }, 1500);
      } catch (error) {
        console.error("Registration error:", error);
        let errorMessage = "Registration failed. Please try again.";

        if (error.code === "auth/email-already-in-use") {
          errorMessage = "This email is already registered.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email format.";
        } else if (error.code === "auth/weak-password") {
          errorMessage =
            "Password is too weak. Please use a stronger password.";
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
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative max-w-4xl w-full">
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-amber-500/20 p-8 sm:p-12">
          {/* Header */}
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
                className="h-20 w-auto object-contain transform hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Tailor Registration
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Join DorjiHub and grow your tailoring business
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border ${
                      errors.fullName
                        ? "border-red-500"
                        : "border-slate-600 focus:border-amber-500"
                    } text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300 placeholder-gray-500`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border ${
                      errors.email
                        ? "border-red-500"
                        : "border-slate-600 focus:border-amber-500"
                    } text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300 placeholder-gray-500`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border ${
                      errors.phone
                        ? "border-red-500"
                        : "border-slate-600 focus:border-amber-500"
                    } text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300 placeholder-gray-500`}
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.phone}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Years of Experience
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaCut className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-slate-700/50 border ${
                      errors.experience
                        ? "border-red-500"
                        : "border-slate-600 focus:border-amber-500"
                    } text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300 placeholder-gray-500`}
                    placeholder="e.g., 5 years"
                  />
                </div>
                {errors.experience && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.experience}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 bg-slate-700/50 border ${
                      errors.password
                        ? "border-red-500"
                        : "border-slate-600 focus:border-amber-500"
                    } text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300 placeholder-gray-500`}
                    placeholder="Create a password"
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
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-300 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3 bg-slate-700/50 border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-slate-600 focus:border-amber-500"
                    } text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300 placeholder-gray-500`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="text-xl" />
                    ) : (
                      <FaEye className="text-xl" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <span className="mr-1">⚠</span> {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-1 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-800 cursor-pointer"
                required
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-400">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-amber-400 hover:text-amber-300 transition-colors duration-200"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-amber-400 hover:text-amber-300 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3.5 rounded-xl hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-800 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link
                  to="/tailor-login"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors duration-200"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2024 DorjiHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default TailorRegister;
