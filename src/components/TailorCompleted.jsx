import React, { useState, useEffect } from "react";
import { db, auth } from "../config/firebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FaSearch, FaEye, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TailorNavbar from "./TailorNavbar";

const TailorCompleted = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCompletedOrders(user.uid);
      } else {
        setLoading(false);
        toast.error("Please login to view orders");
        navigate("/tailor-login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchCompletedOrders = async (tailorId) => {
    try {
      setLoading(true);
      const ordersQuery = query(
        collection(db, "orders"),
        where("tailorId", "==", tailorId)
      );
      const ordersSnap = await getDocs(ordersQuery);
      const ordersData = ordersSnap.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(
          (order) =>
            order.status?.toLowerCase() === "completed" ||
            order.status?.toLowerCase() === "delivered"
        );
      // Sort in JavaScript
      ordersData.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
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
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const calculateTotalEarnings = () => {
    return orders.reduce(
      (sum, order) => sum + parseFloat(order.totalPrice || 0),
      0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading completed orders...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FaCheckCircle className="text-green-600" />
            Completed Orders
          </h1>
          <p className="text-gray-600">Successfully completed orders</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FaCheckCircle className="text-4xl" />
            </div>
            <h3 className="text-4xl font-bold mb-1">{orders.length}</h3>
            <p className="text-green-100">Completed Orders</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-4xl font-bold mb-1">
              ${calculateTotalEarnings().toFixed(2)}
            </h3>
            <p className="text-emerald-100">Total Earnings</p>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.length === 0 ? (
            <div className="col-span-3 bg-white rounded-xl shadow-md p-12 text-center">
              <FaCheckCircle className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                No completed orders yet
              </p>
              <p className="text-gray-400 text-sm">
                Completed orders will appear here
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-semibold text-gray-900">
                        {order.customerName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completed Date</p>
                      <p className="text-gray-900">
                        {formatDate(order.updatedAt || order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${parseFloat(order.totalPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewOrder(order)}
                    className="w-full px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition font-medium flex items-center justify-center gap-2"
                  >
                    <FaEye />
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FaCheckCircle />
                Order Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-white hover:text-gray-200"
              >
                <FaTimesCircle className="text-2xl" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">
                    #{selectedOrder.id.slice(0, 8)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    <FaCheckCircle />
                    {selectedOrder.status || "Completed"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-semibold">
                    {selectedOrder.customerName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="font-semibold text-green-600">
                    ${parseFloat(selectedOrder.totalPrice || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-semibold">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed Date</p>
                  <p className="font-semibold">
                    {formatDate(
                      selectedOrder.updatedAt || selectedOrder.createdAt
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Delivery Date</p>
                  <p className="font-semibold">
                    {selectedOrder.deliveryDate || "Not set"}
                  </p>
                </div>
              </div>
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Notes</p>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✓ This order has been successfully completed
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TailorCompleted;
