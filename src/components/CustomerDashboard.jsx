import React, { useState, useEffect } from "react";
import { auth, db } from "../config/firebaseConfig";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaShoppingBag,
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaBox,
  FaTruck,
  FaMoneyBillWave,
  FaCreditCard,
} from "react-icons/fa";

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login to view orders");
        navigate("/login");
        return;
      }

      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("userId", "==", user.uid));

      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by createdAt in descending order (newest first)
      ordersData.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.seconds - a.createdAt.seconds;
      });

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    const styles = {
      pending: "bg-yellow-500 text-white",
      approved: "bg-blue-500 text-white",
      processing: "bg-purple-500 text-white",
      completed: "bg-green-500 text-white",
      delivered: "bg-teal-500 text-white",
      cancelled: "bg-red-500 text-white",
    };
    return styles[statusLower] || "bg-gray-500 text-white";
  };

  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    const icons = {
      pending: <FaClock />,
      approved: <FaCheckCircle />,
      processing: <FaBox />,
      completed: <FaTruck />,
      delivered: <FaCheckCircle />,
      cancelled: <FaTimes />,
    };
    return icons[statusLower] || <FaShoppingBag />;
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === "all") return true;
    return order.orderStatus?.toLowerCase() === selectedStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus?.toLowerCase() === "pending")
      .length,
    processing: orders.filter(
      (o) =>
        o.orderStatus?.toLowerCase() === "approved" ||
        o.orderStatus?.toLowerCase() === "processing"
    ).length,
    completed: orders.filter(
      (o) =>
        o.orderStatus?.toLowerCase() === "completed" ||
        o.orderStatus?.toLowerCase() === "delivered"
    ).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your tailoring orders
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <FaShoppingBag className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <FaClock className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Processing</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.processing}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <FaBox className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.completed}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: "all" },
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Processing", value: "processing" },
              { label: "Completed", value: "completed" },
              { label: "Delivered", value: "delivered" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedStatus === filter.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-500">
              {selectedStatus === "all"
                ? "You haven't placed any orders yet"
                : `No ${selectedStatus} orders`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between mb-4 pb-4 border-b">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Order ID</p>
                        <p className="font-semibold text-gray-900">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-medium text-gray-700">
                          {order.createdAt
                            ? new Date(
                                order.createdAt.seconds * 1000
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus || "Pending"}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3 mb-4">
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex gap-2">
                          <img
                            src={item.design.imageUrl}
                            alt={item.design.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <img
                            src={item.fabric.imageUrl}
                            alt={item.fabric.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {item.design.name} + {item.fabric.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.design.category} • {item.fabric.category}
                          </p>
                        </div>
                        <p className="font-bold text-blue-600">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-wrap items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {order.paymentMethod === "cod" ? (
                        <>
                          <FaMoneyBillWave className="text-green-600" />
                          <span>Cash on Delivery</span>
                        </>
                      ) : (
                        <>
                          <FaCreditCard className="text-blue-600" />
                          <span>Online - {order.paymentOption}</span>
                        </>
                      )}
                      <span className="mx-2">•</span>
                      <span>Payment: {order.paymentStatus}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
