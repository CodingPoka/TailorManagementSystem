import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaShoppingCart,
  FaTrash,
  FaTshirt,
  FaPalette,
  FaArrowRight,
  FaShoppingBag,
  FaTimes,
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaCreditCard,
  FaMoneyBillWave,
  FaMobileAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { auth, db } from "../config/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    address: "",
    phone: "",
    paymentMethod: "",
    paymentOption: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  // Load cart items from localStorage
  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(cart);
    };
    loadCart();

    // Listen for storage changes
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  // Remove item from cart
  const handleRemoveItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item removed from cart");
  };

  // Clear entire cart
  const handleClearCart = () => {
    setCartItems([]);
    localStorage.setItem("cart", JSON.stringify([]));
    toast.success("Cart cleared");
  };

  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Check if user is logged in
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to continue");
      navigate("/customer-login", { state: { from: "/cart" } });
      return;
    }

    setShowCheckoutModal(true);
    setCheckoutStep(1);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Validate and proceed to payment
  const handleProceedToPayment = () => {
    if (!orderDetails.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!orderDetails.address.trim()) {
      toast.error("Please enter your address");
      return;
    }
    if (!orderDetails.phone.trim() || orderDetails.phone.length < 11) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setCheckoutStep(2);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setOrderDetails((prev) => ({
      ...prev,
      paymentMethod: method,
      paymentOption: "",
    }));
  };

  // Confirm order
  const handleConfirmOrder = async () => {
    if (!orderDetails.paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (
      orderDetails.paymentMethod === "online" &&
      !orderDetails.paymentOption
    ) {
      toast.error("Please select an online payment option");
      return;
    }

    setIsProcessing(true);

    try {
      const user = auth.currentUser;

      // Prepare order data
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        customerName: orderDetails.name,
        customerAddress: orderDetails.address,
        customerPhone: orderDetails.phone,
        items: cartItems,
        totalAmount: parseFloat(calculateTotal()),
        paymentMethod: orderDetails.paymentMethod,
        paymentOption: orderDetails.paymentOption || "N/A",
        paymentStatus:
          orderDetails.paymentMethod === "cod" ? "Pending" : "Processing",
        orderStatus: "Pending",
        createdAt: serverTimestamp(),
      };

      // Save order to Firestore
      await addDoc(collection(db, "orders"), orderData);

      // Clear cart
      localStorage.setItem("cart", JSON.stringify([]));
      setCartItems([]);

      setCheckoutStep(3);
      toast.success("Order placed successfully!");

      // Redirect after 3 seconds
      setTimeout(() => {
        setShowCheckoutModal(false);
        setCheckoutStep(1);
        setOrderDetails({
          name: "",
          address: "",
          phone: "",
          paymentMethod: "",
          paymentOption: "",
        });
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <FaShoppingCart className="text-blue-600" />
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-2">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2 transition-colors"
              >
                <FaTrash />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <FaShoppingBag className="text-8xl text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start shopping by selecting a design and fabric combination to
              create your perfect outfit!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/design")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
              >
                <FaPalette />
                Browse Designs
              </button>
              <button
                onClick={() => navigate("/fabrics")}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
              >
                <FaTshirt />
                Browse Fabrics
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Design Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
                          <img
                            src={item.design.imageUrl}
                            alt={item.design.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-600 to-transparent p-2">
                            <p className="text-white text-xs font-semibold flex items-center gap-1">
                              <FaPalette className="text-xs" />
                              Design
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Fabric Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-teal-100">
                          <img
                            src={item.fabric.imageUrl}
                            alt={item.fabric.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-transparent p-2">
                            <p className="text-white text-xs font-semibold flex items-center gap-1">
                              <FaTshirt className="text-xs" />
                              Fabric
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                              {item.design.name} + {item.fabric.name}
                            </h3>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Design:</span>{" "}
                                {item.design.category}
                              </p>

                              {/* Checkout Modal */}
                              {showCheckoutModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                                  <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                    {/* Modal Header */}
                                    <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
                                      <div>
                                        <h2 className="text-2xl font-bold">
                                          {checkoutStep === 1 &&
                                            "Delivery Details"}
                                          {checkoutStep === 2 &&
                                            "Payment Method"}
                                          {checkoutStep === 3 &&
                                            "Order Confirmed"}
                                        </h2>
                                        <p className="text-sm text-purple-100 mt-1">
                                          Step {checkoutStep} of 3
                                        </p>
                                      </div>
                                      <button
                                        onClick={() =>
                                          setShowCheckoutModal(false)
                                        }
                                        className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
                                      >
                                        <FaTimes className="text-xl" />
                                      </button>
                                    </div>

                                    <div className="p-6">
                                      {/* Step 1: Delivery Details */}
                                      {checkoutStep === 1 && (
                                        <div className="space-y-6">
                                          <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                              <FaUser className="inline mr-2 text-purple-600" />
                                              Full Name *
                                            </label>
                                            <input
                                              type="text"
                                              name="name"
                                              value={orderDetails.name}
                                              onChange={handleInputChange}
                                              placeholder="Enter your full name"
                                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                          </div>

                                          <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                              <FaMapMarkerAlt className="inline mr-2 text-purple-600" />
                                              Delivery Address *
                                            </label>
                                            <textarea
                                              name="address"
                                              value={orderDetails.address}
                                              onChange={handleInputChange}
                                              placeholder="Enter your complete delivery address"
                                              rows="3"
                                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            ></textarea>
                                          </div>

                                          <div>
                                            <label className="block text-gray-700 font-semibold mb-2">
                                              <FaPhone className="inline mr-2 text-purple-600" />
                                              Phone Number *
                                            </label>
                                            <input
                                              type="tel"
                                              name="phone"
                                              value={orderDetails.phone}
                                              onChange={handleInputChange}
                                              placeholder="01XXXXXXXXX"
                                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                          </div>

                                          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600 mb-2">
                                              Order Summary:
                                            </p>
                                            <div className="flex justify-between items-center">
                                              <span className="font-semibold text-gray-800">
                                                {cartItems.length} item(s)
                                              </span>
                                              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                                                ${calculateTotal()}
                                              </span>
                                            </div>
                                          </div>

                                          <button
                                            onClick={handleProceedToPayment}
                                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                          >
                                            Proceed to Payment
                                            <FaArrowRight />
                                          </button>
                                        </div>
                                      )}

                                      {/* Step 2: Payment Method */}
                                      {checkoutStep === 2 && (
                                        <div className="space-y-6">
                                          {/* Cash on Delivery */}
                                          <div
                                            onClick={() =>
                                              handlePaymentMethodSelect("cod")
                                            }
                                            className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                                              orderDetails.paymentMethod ===
                                              "cod"
                                                ? "border-green-500 bg-green-50"
                                                : "border-gray-300 hover:border-green-400"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-4">
                                                <FaMoneyBillWave className="text-4xl text-green-600" />
                                                <div>
                                                  <h3 className="text-xl font-bold text-gray-800">
                                                    Cash on Delivery
                                                  </h3>
                                                  <p className="text-sm text-gray-600">
                                                    Pay when you receive your
                                                    order
                                                  </p>
                                                </div>
                                              </div>
                                              {orderDetails.paymentMethod ===
                                                "cod" && (
                                                <FaCheckCircle className="text-3xl text-green-600" />
                                              )}
                                            </div>
                                          </div>

                                          {/* Online Payment */}
                                          <div
                                            onClick={() =>
                                              handlePaymentMethodSelect(
                                                "online"
                                              )
                                            }
                                            className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                                              orderDetails.paymentMethod ===
                                              "online"
                                                ? "border-purple-500 bg-purple-50"
                                                : "border-gray-300 hover:border-purple-400"
                                            }`}
                                          >
                                            <div className="flex items-center justify-between mb-4">
                                              <div className="flex items-center gap-4">
                                                <FaCreditCard className="text-4xl text-purple-600" />
                                                <div>
                                                  <h3 className="text-xl font-bold text-gray-800">
                                                    Online Payment
                                                  </h3>
                                                  <p className="text-sm text-gray-600">
                                                    Pay securely online
                                                  </p>
                                                </div>
                                              </div>
                                              {orderDetails.paymentMethod ===
                                                "online" && (
                                                <FaCheckCircle className="text-3xl text-purple-600" />
                                              )}
                                            </div>

                                            {/* Online Payment Options */}
                                            {orderDetails.paymentMethod ===
                                              "online" && (
                                              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-purple-200">
                                                {[
                                                  {
                                                    name: "Card",
                                                    icon: FaCreditCard,
                                                    color: "blue",
                                                  },
                                                  {
                                                    name: "bKash",
                                                    icon: FaMobileAlt,
                                                    color: "pink",
                                                  },
                                                  {
                                                    name: "Nagad",
                                                    icon: FaMobileAlt,
                                                    color: "orange",
                                                  },
                                                  {
                                                    name: "Rocket",
                                                    icon: FaMobileAlt,
                                                    color: "purple",
                                                  },
                                                ].map((option) => (
                                                  <button
                                                    key={option.name}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setOrderDetails(
                                                        (prev) => ({
                                                          ...prev,
                                                          paymentOption:
                                                            option.name,
                                                        })
                                                      );
                                                    }}
                                                    className={`p-4 rounded-lg border-2 transition-all duration-300 flex items-center gap-3 ${
                                                      orderDetails.paymentOption ===
                                                      option.name
                                                        ? `border-${option.color}-500 bg-${option.color}-50`
                                                        : "border-gray-300 hover:border-gray-400"
                                                    }`}
                                                  >
                                                    <option.icon
                                                      className={`text-2xl text-${option.color}-600`}
                                                    />
                                                    <span className="font-semibold text-gray-800">
                                                      {option.name}
                                                    </span>
                                                  </button>
                                                ))}
                                              </div>
                                            )}
                                          </div>

                                          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                              <span className="font-semibold text-gray-800">
                                                Total Amount:
                                              </span>
                                              <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                                                ${calculateTotal()}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="flex gap-3">
                                            <button
                                              onClick={() => setCheckoutStep(1)}
                                              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold"
                                            >
                                              Back
                                            </button>
                                            <button
                                              onClick={handleConfirmOrder}
                                              disabled={isProcessing}
                                              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              {isProcessing
                                                ? "Processing..."
                                                : "Confirm Order"}
                                            </button>
                                          </div>
                                        </div>
                                      )}

                                      {/* Step 3: Order Confirmation */}
                                      {checkoutStep === 3 && (
                                        <div className="text-center py-8">
                                          <div className="mb-6">
                                            <FaCheckCircle className="text-8xl text-green-500 mx-auto animate-bounce" />
                                          </div>
                                          <h3 className="text-3xl font-bold text-gray-800 mb-4">
                                            Order Placed Successfully!
                                          </h3>
                                          <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                            Thank you for your order. We'll send
                                            you a confirmation message shortly.
                                          </p>
                                          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
                                            <div className="space-y-3 text-left">
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Order Total:
                                                </span>
                                                <span className="font-bold text-green-600">
                                                  ${calculateTotal()}
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Payment Method:
                                                </span>
                                                <span className="font-semibold text-gray-800">
                                                  {orderDetails.paymentMethod ===
                                                  "cod"
                                                    ? "Cash on Delivery"
                                                    : `Online - ${orderDetails.paymentOption}`}
                                                </span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                  Delivery to:
                                                </span>
                                                <span className="font-semibold text-gray-800 text-right max-w-xs">
                                                  {orderDetails.address}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => navigate("/")}
                                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                                          >
                                            Continue Shopping
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Fabric:</span>{" "}
                                {item.fabric.category}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            title="Remove item"
                          >
                            <FaTrash />
                          </button>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Design Price:</span>
                            <span className="font-semibold text-purple-600">
                              ${item.design.price}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Fabric Price:</span>
                            <span className="font-semibold text-blue-600">
                              ${item.fabric.price}
                            </span>
                          </div>
                          <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
                            <span className="text-gray-800">Total:</span>
                            <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                        ${calculateTotal()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Proceed to Checkout
                  <FaArrowRight />
                </button>

                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => navigate("/design")}
                    className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-lg hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                  >
                    <FaPalette />
                    Add More Designs
                  </button>
                  <button
                    onClick={() => navigate("/fabrics")}
                    className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                  >
                    <FaTshirt />
                    Add More Fabrics
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCart;
