import React, { useState, useEffect } from "react";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaSave,
  FaTimes,
  FaCut,
  FaLock,
  FaKey,
  FaCalendarAlt,
  FaStar,
  FaBriefcase,
  FaMapMarkerAlt,
} from "react-icons/fa";
import TailorNavbar from "./TailorNavbar";

const TailorProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    address: "",
    experience: "",
    specialization: "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({ ...data, email: user.email });
        setEditData({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          experience: data.experience || "",
          specialization: data.specialization || "",
        });
      } else {
        setUserData({
          name: user.displayName || "Tailor",
          email: user.email,
          role: "tailor",
        });
        setEditData({
          name: user.displayName || "Tailor",
          phone: "",
          address: "",
          experience: "",
          specialization: "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      name: userData.name || "",
      phone: userData.phone || "",
      address: userData.address || "",
      experience: userData.experience || "",
      specialization: userData.specialization || "",
    });
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login to update profile");
        return;
      }

      await updateDoc(doc(db, "users", user.uid), {
        name: editData.name,
        phone: editData.phone,
        address: editData.address,
        experience: editData.experience,
        specialization: editData.specialization,
        updatedAt: new Date().toISOString(),
      });

      setUserData({
        ...userData,
        name: editData.name,
        phone: editData.phone,
        address: editData.address,
        experience: editData.experience,
        specialization: editData.specialization,
      });
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const user = auth.currentUser;
      await updatePassword(user, passwordData.newPassword);
      toast.success("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.code === "auth/requires-recent-login") {
        toast.error("Please logout and login again to change password");
      } else {
        toast.error("Failed to update password");
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date =
        timestamp.toDate?.() || new Date(timestamp.seconds * 1000 || timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl shadow-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
              <FaCut className="text-white text-5xl" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {userData?.name || "Tailor"}
              </h1>
              {userData?.specialization && (
                <p className="text-purple-100 text-lg mb-2">
                  Specialization: {userData.specialization}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-purple-100">
                <div className="flex items-center gap-2">
                  <FaEnvelope />
                  <span>{userData?.email || "tailor@example.com"}</span>
                </div>
                {userData?.experience && (
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-300" />
                    <span>{userData.experience} years experience</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition shadow-lg flex items-center gap-2"
            >
              <FaKey />
              Change Password
            </button>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaUser />
                Profile Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center gap-2"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition flex items-center gap-2"
                  >
                    <FaSave />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition flex items-center gap-2"
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <FaUser className="text-purple-600" />
                    <span className="text-gray-800 font-medium">
                      {userData?.name || "N/A"}
                    </span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-purple-600" />
                  <span className="text-gray-800 font-medium">
                    {userData?.email || "N/A"}
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <FaPhone className="text-purple-600" />
                    <span className="text-gray-800 font-medium">
                      {userData?.phone || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editData.experience}
                    onChange={(e) =>
                      setEditData({ ...editData, experience: e.target.value })
                    }
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <FaStar className="text-yellow-500" />
                    <span className="text-gray-800 font-medium">
                      {userData?.experience || "0"} years
                    </span>
                  </div>
                )}
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specialization
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.specialization}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        specialization: e.target.value,
                      })
                    }
                    placeholder="e.g., Suits, Dresses, Alterations"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <FaBriefcase className="text-purple-600" />
                    <span className="text-gray-800 font-medium">
                      {userData?.specialization || "General"}
                    </span>
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                  <FaCut className="text-purple-600 text-xl" />
                  <span className="text-purple-700 font-bold uppercase tracking-wide">
                    Professional Tailor
                  </span>
                </div>
              </div>

              {/* Address - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={editData.address}
                    onChange={(e) =>
                      setEditData({ ...editData, address: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition"
                  />
                ) : (
                  <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <FaMapMarkerAlt className="text-purple-600 mt-1" />
                    <span className="text-gray-800 font-medium">
                      {userData?.address || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {/* Account Created */}
              {userData?.createdAt && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Created
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <FaCalendarAlt className="text-purple-600" />
                    <span className="text-gray-800 font-medium">
                      {formatDate(userData.createdAt)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FaLock />
                  Change Password
                </h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            <form onSubmit={handlePasswordChange} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    required
                    minLength={6}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                    required
                    minLength={6}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TailorProfile;
