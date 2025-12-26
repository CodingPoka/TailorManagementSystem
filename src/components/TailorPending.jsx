import React, { useState, useEffect } from "react";
import { db, auth } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import {
  FaSearch,
  FaEye,
  FaEdit,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import TailorNavbar from "./TailorNavbar";

const TailorPending = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchPendingOrders(user.uid);
      } else {
        setLoading(false);
        toast.error("Please login to view orders");
        navigate("/tailor-login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchPendingOrders = async (tailorId) => {
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
            order.status?.toLowerCase() === "pending" ||
            order.status?.toLowerCase() === "processing"
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

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.status || "pending");
    setShowEditModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      const orderRef = doc(db, "orders", selectedOrder.id);
      await updateDoc(orderRef, {
        status: editStatus,
        updatedAt: new Date(),
      });

      toast.success("Order status updated successfully");
      setShowEditModal(false);

      const user = auth.currentUser;
      if (user) {
        fetchPendingOrders(user.uid);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
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
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "pending";
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-700";
    if (statusLower === "processing") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading pending orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-orange-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <FaClock className="text-yellow-600" />
            Pending Orders
          </h1>
          <p className="text-gray-600">Orders awaiting processing</p>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FaClock className="text-4xl" />
            </div>
            <h3 className="text-4xl font-bold mb-1">
              {
                orders.filter((o) => o.status?.toLowerCase() === "pending")
                  .length
              }
            </h3>
            <p className="text-yellow-100">Pending Orders</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FaEdit className="text-4xl" />
            </div>
            <h3 className="text-4xl font-bold mb-1">
              {
                orders.filter((o) => o.status?.toLowerCase() === "processing")
                  .length
              }
            </h3>
            <p className="text-blue-100">Processing Orders</p>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl shadow-md p-12 text-center">
              <FaClock className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No pending orders</p>
              <p className="text-gray-400 text-sm">
                All orders are up to date!
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status || "Pending"}
                    </span>
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
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="text-gray-900">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-yellow-600">
                        ${parseFloat(order.totalPrice || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-medium flex items-center justify-center gap-2"
                    >
                      <FaEye />
                      View
                    </button>
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition font-medium flex items-center justify-center gap-2"
                    >
                      <FaEdit />
                      Update
                    </button>
                  </div>
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
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Order Details</h3>
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
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status || "Pending"}
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
                  <p className="font-semibold text-yellow-600">
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
            </div>
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
              <h3 className="text-xl font-bold text-white">
                Update Order Status
              </h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Order ID: #{selectedOrder.id.slice(0, 8)}
              </p>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent mb-6"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition font-medium"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TailorPending;
