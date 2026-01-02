import React, { useState, useEffect } from "react";
import { db, auth } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  FaShoppingCart,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaDollarSign,
  FaCalendarDay,
  FaCalendarAlt,
  FaChartLine,
  FaEye,
  FaCut,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TailorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tailorName, setTailorName] = useState("Tailor");
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    todayOrders: 0,
    monthlyOrders: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setTailorName(user.displayName || "Tailor");
        fetchAllData(user.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAllData = async (tailorId) => {
    try {
      setLoading(true);
      await Promise.all([fetchStats(tailorId), fetchRecentOrders(tailorId)]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (tailorId) => {
    try {
      const ordersQuery = query(
        collection(db, "orders"),
        where("tailorId", "==", tailorId)
      );
      const ordersSnap = await getDocs(ordersQuery);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      let todayCount = 0;
      let monthlyCount = 0;
      let pendingCount = 0;
      let completedCount = 0;
      let cancelledCount = 0;
      let totalEarnings = 0;
      let monthlyEarnings = 0;

      ordersSnap.forEach((doc) => {
        const data = doc.data();
        const orderDate =
          data.createdAt?.toDate?.() ||
          new Date(data.createdAt?.seconds * 1000 || 0);

        if (orderDate >= today) todayCount++;
        if (orderDate >= startOfMonth) monthlyCount++;

        const status = data.status?.toLowerCase() || "pending";
        if (status === "pending" || status === "processing") pendingCount++;
        else if (status === "completed" || status === "delivered")
          completedCount++;
        else if (status === "cancelled") cancelledCount++;

        const price = parseFloat(data.totalAmount || 0);
        if (status === "completed" || status === "delivered") {
          totalEarnings += price;
          if (orderDate >= startOfMonth) {
            monthlyEarnings += price;
          }
        }
      });

      setStats({
        totalOrders: ordersSnap.size,
        pendingOrders: pendingCount,
        completedOrders: completedCount,
        cancelledOrders: cancelledCount,
        todayOrders: todayCount,
        monthlyOrders: monthlyCount,
        totalEarnings: totalEarnings,
        monthlyEarnings: monthlyEarnings,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentOrders = async (tailorId) => {
    try {
      const ordersQuery = query(
        collection(db, "orders"),
        where("tailorId", "==", tailorId),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const ordersSnap = await getDocs(ordersQuery);
      const orders = ordersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentOrders(orders);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date =
        timestamp.toDate?.() || new Date(timestamp.seconds * 1000 || timestamp);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    switch (statusLower) {
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {tailorName}!{" "}
          </h1>
          <p className="text-gray-600">
            Here's an overview of your tailoring orders today.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                <FaShoppingCart className="text-2xl" />
              </div>
              <FaChartLine className="text-white text-opacity-70" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalOrders}</h3>
            <p className="text-purple-100 text-sm">Total Orders</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                <FaClock className="text-2xl" />
              </div>
              <FaChartLine className="text-white text-opacity-70" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.pendingOrders}</h3>
            <p className="text-yellow-100 text-sm">Pending Orders</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-2xl" />
              </div>
              <FaChartLine className="text-white text-opacity-70" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.completedOrders}</h3>
            <p className="text-green-100 text-sm">Completed Orders</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                <FaDollarSign className="text-2xl" />
              </div>
              <FaChartLine className="text-white text-opacity-70" />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              ${stats.totalEarnings.toFixed(2)}
            </h3>
            <p className="text-pink-100 text-sm">Total Earnings</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaCalendarDay className="text-purple-600 text-xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.todayOrders}
            </h3>
            <p className="text-gray-600 text-sm">Today's Orders</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-blue-600 text-xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.monthlyOrders}
            </h3>
            <p className="text-gray-600 text-sm">This Month</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaDollarSign className="text-green-600 text-xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              ${stats.monthlyEarnings.toFixed(2)}
            </h3>
            <p className="text-gray-600 text-sm">Monthly Earnings</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FaTimesCircle className="text-red-600 text-xl" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.cancelledOrders}
            </h3>
            <p className="text-gray-600 text-sm">Cancelled Orders</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaShoppingCart />
              Recent Orders
            </h2>
          </div>
          <div className="p-6">
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <FaCut className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No orders yet</p>
                <p className="text-gray-400 text-sm">
                  Your assigned orders will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex-1 mb-3 sm:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">
                          Order #{order.id.slice(0, 8)}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status || "Pending"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.customerName || "Customer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <p className="font-bold text-gray-800 text-lg">
                        ${parseFloat(order.totalPrice || 0).toFixed(2)}
                      </p>
                      <button
                        onClick={() => navigate(`/tailor/order/${order.id}`)}
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                      >
                        <FaEye />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => navigate("/tailor-orders")}
              className="w-full mt-4 bg-purple-50 hover:bg-purple-100 text-purple-600 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <FaEye />
              View All Orders
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/tailor-orders")}
              className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-lg transition transform hover:scale-105 shadow-md"
            >
              <FaShoppingCart className="text-2xl mx-auto mb-2" />
              <span className="text-sm font-semibold">All Orders</span>
            </button>
            <button
              onClick={() => navigate("/tailor-pending")}
              className="bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white p-4 rounded-lg transition transform hover:scale-105 shadow-md"
            >
              <FaClock className="text-2xl mx-auto mb-2" />
              <span className="text-sm font-semibold">Pending</span>
            </button>
            <button
              onClick={() => navigate("/tailor-completed")}
              className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-4 rounded-lg transition transform hover:scale-105 shadow-md"
            >
              <FaCheckCircle className="text-2xl mx-auto mb-2" />
              <span className="text-sm font-semibold">Completed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailorDashboard;
