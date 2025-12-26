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
  FaUsers,
  FaUserTie,
  FaShoppingCart,
  FaTshirt,
  FaCalendarDay,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaChartLine,
  FaDollarSign,
  FaBox,
  FaPalette,
  FaEye,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTailors: 0,
    totalOrders: 0,
    todayOrders: 0,
    monthlyOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalFabrics: 0,
    totalDesigns: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdminName(user.displayName || "Admin");
        fetchAllData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchRecentOrders(),
        fetchRecentCustomers(),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch all data in parallel for better performance
      const [customersSnap, tailorsSnap, ordersSnap, fabricsSnap, designsSnap] =
        await Promise.all([
          getDocs(
            query(collection(db, "users"), where("role", "==", "customer"))
          ),
          getDocs(
            query(collection(db, "users"), where("role", "==", "tailor"))
          ),
          getDocs(collection(db, "orders")),
          getDocs(collection(db, "fabrics")),
          getDocs(collection(db, "designs")),
        ]);

      // Calculate date ranges
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      let todayCount = 0;
      let monthlyCount = 0;
      let pendingCount = 0;
      let completedCount = 0;
      let cancelledCount = 0;
      let totalRevenue = 0;

      ordersSnap.forEach((doc) => {
        const data = doc.data();
        const orderDate =
          data.createdAt?.toDate?.() ||
          new Date(data.createdAt?.seconds * 1000 || 0);

        // Count by date
        if (orderDate >= today) todayCount++;
        if (orderDate >= startOfMonth) monthlyCount++;

        // Count by status
        const status = data.status?.toLowerCase() || "pending";
        if (status === "pending" || status === "processing") pendingCount++;
        else if (status === "completed" || status === "delivered")
          completedCount++;
        else if (status === "cancelled") cancelledCount++;

        // Calculate revenue (only completed orders)
        if (status === "completed" || status === "delivered") {
          totalRevenue += parseFloat(data.totalPrice || 0);
        }
      });

      setStats({
        totalCustomers: customersSnap.size,
        totalTailors: tailorsSnap.size,
        totalOrders: ordersSnap.size,
        todayOrders: todayCount,
        monthlyOrders: monthlyCount,
        pendingOrders: pendingCount,
        completedOrders: completedCount,
        cancelledOrders: cancelledCount,
        totalFabrics: fabricsSnap.size,
        totalDesigns: designsSnap.size,
        totalRevenue: totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const ordersQuery = query(
        collection(db, "orders"),
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

  const fetchRecentCustomers = async () => {
    try {
      const customersQuery = query(
        collection(db, "users"),
        where("role", "==", "customer"),
        orderBy("createdAt", "desc"),
        limit(5)
      );
      const customersSnap = await getDocs(customersQuery);
      const customers = customersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentCustomers(customers);
    } catch (error) {
      console.error("Error fetching recent customers:", error);
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
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {adminName}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your tailor business today.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Total Customers */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                <FaUsers className="text-2xl" />
              </div>
              <FaChartLine className="text-white text-opacity-70" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalCustomers}</h3>
            <p className="text-blue-100 text-sm">Total Customers</p>
          </div>

          {/* Total Tailors */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                <FaUserTie className="text-2xl" />
              </div>
              <FaChartLine className="text-white text-opacity-70" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalTailors}</h3>
            <p className="text-purple-100 text-sm">Total Tailors</p>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                <FaShoppingCart className="text-2xl" />
              </div>
              <FaChartLine className="text-white text-opacity-70" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalOrders}</h3>
            <p className="text-green-100 text-sm">Total Orders</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                <FaDollarSign className="text-2xl" />
              </div>
              <FaChartLine className="text-white text-opacity-70" />
            </div>
            <h3 className="text-3xl font-bold mb-1">
              ${stats.totalRevenue.toFixed(2)}
            </h3>
            <p className="text-orange-100 text-sm">Total Revenue</p>
          </div>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Today's Orders */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCalendarDay className="text-blue-600 text-xl" />
              </div>
              {stats.todayOrders > 0 && (
                <span className="flex items-center text-green-600 text-sm font-medium">
                  <FaArrowUp className="mr-1" />
                  New
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.todayOrders}
            </h3>
            <p className="text-gray-600 text-sm">Today's Orders</p>
          </div>

          {/* Monthly Orders */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-purple-600 text-xl" />
              </div>
              <FaChartLine className="text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.monthlyOrders}
            </h3>
            <p className="text-gray-600 text-sm">This Month</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-yellow-600 text-xl" />
              </div>
              {stats.pendingOrders > 0 && (
                <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {stats.pendingOrders}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.pendingOrders}
            </h3>
            <p className="text-gray-600 text-sm">Pending Orders</p>
          </div>

          {/* Completed Orders */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <span className="text-green-600 text-sm font-medium">
                {stats.totalOrders > 0
                  ? Math.round(
                      (stats.completedOrders / stats.totalOrders) * 100
                    )
                  : 0}
                %
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {stats.completedOrders}
            </h3>
            <p className="text-gray-600 text-sm">Completed Orders</p>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Fabrics */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaTshirt className="text-pink-600 text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalFabrics}
                </h3>
                <p className="text-gray-600 text-sm">Total Fabrics</p>
              </div>
            </div>
          </div>

          {/* Designs */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaPalette className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.totalDesigns}
                </h3>
                <p className="text-gray-600 text-sm">Total Designs</p>
              </div>
            </div>
          </div>

          {/* Cancelled Orders */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaTimesCircle className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.cancelledOrders}
                </h3>
                <p className="text-gray-600 text-sm">Cancelled Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaShoppingCart />
                Recent Orders
              </h2>
            </div>
            <div className="p-6">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex-1">
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
                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          ${parseFloat(order.totalPrice || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => navigate("/admin/orders")}
                className="w-full mt-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FaEye />
                View All Orders
              </button>
            </div>
          </div>

          {/* Recent Customers */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaUsers />
                Recent Customers
              </h2>
            </div>
            <div className="p-6">
              {recentCustomers.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No customers yet
                </p>
              ) : (
                <div className="space-y-4">
                  {recentCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-lg">
                          {customer.name?.charAt(0).toUpperCase() || "C"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {customer.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {customer.email || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Joined {formatDate(customer.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => navigate("/admin-customers")}
                className="w-full mt-4 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FaEye />
                View All Customers
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/admin-customers")}
              className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-lg transition transform hover:scale-105 shadow-md"
            >
              <FaUsers className="text-2xl mx-auto mb-2" />
              <span className="text-sm font-semibold">Manage Customers</span>
            </button>
            <button
              onClick={() => navigate("/admin-tailors")}
              className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-lg transition transform hover:scale-105 shadow-md"
            >
              <FaUserTie className="text-2xl mx-auto mb-2" />
              <span className="text-sm font-semibold">Manage Tailors</span>
            </button>
            <button
              onClick={() => navigate("/admin-fabrics")}
              className="bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white p-4 rounded-lg transition transform hover:scale-105 shadow-md"
            >
              <FaTshirt className="text-2xl mx-auto mb-2" />
              <span className="text-sm font-semibold">Manage Fabrics</span>
            </button>
            <button
              onClick={() => navigate("/admin-designs")}
              className="bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-4 rounded-lg transition transform hover:scale-105 shadow-md"
            >
              <FaPalette className="text-2xl mx-auto mb-2" />
              <span className="text-sm font-semibold">Manage Designs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
