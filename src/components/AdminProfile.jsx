import React, { useState, useEffect } from "react";
import { auth, db } from "../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, updateEmail, onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaSave,
  FaTimes,
  FaUserShield,
  FaLock,
  FaKey,
  FaUserCircle,
  FaCrown,
  FaCalendarAlt,
  FaChartLine,
  FaUsers,
  FaCog,
} from "react-icons/fa";

const AdminProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTailors: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    organization: "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Wait for Firebase Auth to initialize before fetching data
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData();
        fetchStats();
      } else {
        setLoading(false);
        // Only show error if user actually navigated to profile without login
        // Don't show on initial auth state check
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
          organization: data.organization || "Tailor Management System",
        });
      } else {
        // If no Firestore doc, create one from auth data
        setUserData({
          name: user.displayName || "Admin",
          email: user.email,
          role: "admin",
        });
        setEditData({
          name: user.displayName || "Admin",
          phone: "",
          organization: "Tailor Management System",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Fetch statistics from Firestore
      const collections = ["users", "orders", "fabrics", "designs"];
      const [usersSnap, ordersSnap, fabricsSnap, designsSnap] =
        await Promise.all(
          collections.map((col) =>
            getDoc(doc(db, "_stats", col)).catch(() => null)
          )
        );

      // If stats collection doesn't exist, try to count manually
      const { collection, getDocs, query, where } = await import(
        "firebase/firestore"
      );

      const customersQuery = query(
        collection(db, "users"),
        where("role", "==", "customer")
      );
      const tailorsQuery = query(
        collection(db, "users"),
        where("role", "==", "tailor")
      );
      const ordersQuery = collection(db, "orders");
      const fabricsQuery = collection(db, "fabrics");

      const [customers, tailors, orders, fabrics] = await Promise.all([
        getDocs(customersQuery),
        getDocs(tailorsQuery),
        getDocs(ordersQuery),
        getDocs(fabricsQuery),
      ]);

      setStats({
        totalCustomers: customers.size,
        totalTailors: tailors.size,
        totalOrders: orders.size,
        totalProducts: fabrics.size,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
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
      organization: userData.organization || "Tailor Management System",
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
        organization: editData.organization,
        updatedAt: new Date().toISOString(),
      });

      setUserData({
        ...userData,
        name: editData.name,
        phone: editData.phone,
        organization: editData.organization,
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-32 -mb-32"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
              <FaUserShield className="text-white text-5xl" />
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <FaCrown className="text-yellow-300 text-2xl" />
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {userData?.name || "Admin"}
                </h1>
              </div>
              <p className="text-indigo-100 text-lg mb-2">
                {userData?.organization || "Tailor Management System"}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-indigo-100">
                <div className="flex items-center gap-2">
                  <FaEnvelope />
                  <span>{userData?.email || "admin@example.com"}</span>
                </div>
                {userData?.createdAt && (
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <span>Since {formatDate(userData.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition shadow-lg flex items-center gap-2"
            >
              <FaKey />
              Change Password
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Customers
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.totalCustomers}
                </h3>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Tailors
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.totalTailors}
                </h3>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <FaUserCircle className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Orders
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.totalOrders}
                </h3>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <FaChartLine className="text-green-600 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Total Products
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.totalProducts}
                </h3>
              </div>
              <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
                <FaCog className="text-orange-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaUser />
                Profile Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition flex items-center gap-2"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <FaUser className="text-indigo-600" />
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
                  <FaEnvelope className="text-indigo-600" />
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <FaPhone className="text-indigo-600" />
                    <span className="text-gray-800 font-medium">
                      {userData?.phone || "Not provided"}
                    </span>
                  </div>
                )}
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organization
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.organization}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        organization: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  />
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <FaCrown className="text-indigo-600" />
                    <span className="text-gray-800 font-medium">
                      {userData?.organization || "Tailor Management System"}
                    </span>
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
                  <FaUserShield className="text-indigo-600 text-xl" />
                  <span className="text-indigo-700 font-bold uppercase tracking-wide">
                    Administrator
                  </span>
                </div>
              </div>

              {/* Account Created */}
              {userData?.createdAt && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Created
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <FaCalendarAlt className="text-indigo-600" />
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
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
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
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
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
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition"
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

export default AdminProfile;
