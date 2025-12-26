import React, { useState, useEffect } from "react";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

const CustomerProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login to view profile");
        return;
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setEditData({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await updateDoc(doc(db, "users", user.uid), {
        name: editData.name,
        phone: editData.phone,
        address: editData.address,
      });

      setUserData((prev) => ({ ...prev, ...editData }));
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditData({
      name: userData.name || "",
      phone: userData.phone || "",
      address: userData.address || "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <FaUserCircle className="text-8xl text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {userData?.name || "User"}
                </h2>
                <p className="text-blue-100 flex items-center gap-2">
                  <FaEnvelope />
                  {userData?.email}
                </p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaUser className="text-blue-600" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              ) : (
                <p className="text-gray-800 text-lg bg-gray-50 px-4 py-3 rounded-lg">
                  {userData?.name || "Not provided"}
                </p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaEnvelope className="text-blue-600" />
                Email Address
              </label>
              <p className="text-gray-800 text-lg bg-gray-50 px-4 py-3 rounded-lg">
                {userData?.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaPhone className="text-blue-600" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="01XXXXXXXXX"
                />
              ) : (
                <p className="text-gray-800 text-lg bg-gray-50 px-4 py-3 rounded-lg">
                  {userData?.phone || "Not provided"}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" />
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={editData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your complete address"
                ></textarea>
              ) : (
                <p className="text-gray-800 text-lg bg-gray-50 px-4 py-3 rounded-lg">
                  {userData?.address || "Not provided"}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                >
                  <FaSave />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Account Type</p>
                <p className="font-semibold text-gray-800">Customer</p>
              </div>
              <div>
                <p className="text-gray-600">Member Since</p>
                <p className="font-semibold text-gray-800">
                  {userData?.createdAt
                    ? new Date(
                        userData.createdAt.seconds * 1000
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
