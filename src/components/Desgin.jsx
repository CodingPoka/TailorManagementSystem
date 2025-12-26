import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaPalette,
  FaShoppingCart,
  FaTag,
  FaFilter,
  FaSearch,
  FaCheckCircle,
  FaTshirt,
} from "react-icons/fa";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "../config/firebaseConfig";
import toast from "react-hot-toast";

const Design = () => {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get selected fabric from navigation state (if coming from fabrics page)
  const selectedFabric = location.state?.selectedFabric || null;

  const db = getFirestore(app);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const categoriesRef = collection(db, "designCategories");
      const q = query(categoriesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const categoriesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch designs
  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const designsRef = collection(db, "designs");
      const q = query(designsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const designsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDesigns(designsData);
    } catch (error) {
      console.error("Error fetching designs:", error);
      toast.error("Failed to load designs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchDesigns();
  }, []);

  // Handle Order/Selection
  const handleOrder = (design) => {
    if (selectedFabric) {
      // Both design and fabric selected - add to cart
      const cartItem = {
        design: design,
        fabric: selectedFabric,
        totalPrice: design.price + selectedFabric.price,
        addedAt: new Date().toISOString(),
      };

      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      existingCart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(existingCart));

      toast.success(
        `Added to cart! Design: ${design.name} + Fabric: ${selectedFabric.name}`
      );
      navigate("/cart");
    } else {
      // Only design selected - redirect to fabrics
      toast.success(`Design "${design.name}" selected! Now choose a fabric.`);
      navigate("/fabrics", { state: { selectedDesign: design } });
    }
  };

  // Filter designs
  const filteredDesigns = designs
    .filter(
      (design) =>
        selectedCategory === "all" || design.category === selectedCategory
    )
    .filter(
      (design) =>
        design.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        design.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaPalette className="text-6xl mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {selectedFabric ? "Choose Your Design" : "Explore Our Designs"}
            </h1>
            <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto">
              {selectedFabric
                ? `Select a design to pair with your ${selectedFabric.name}`
                : "Discover unique and elegant tailor designs crafted just for you"}
            </p>

            {/* Show selected fabric banner */}
            {selectedFabric && (
              <div className="mt-6 inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
                <FaCheckCircle className="text-green-300 text-xl" />
                <span className="font-semibold">
                  Selected Fabric: {selectedFabric.name}
                </span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  ${selectedFabric.price}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <FaFilter className="text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 lg:flex-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              All ({designs.length})
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {category.name} (
                {designs.filter((d) => d.category === category.name).length})
              </button>
            ))}
          </div>
        </div>

        {/* Designs Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-6 text-lg">Loading designs...</p>
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <FaPalette className="text-7xl mx-auto mb-6 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No Designs Found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Check back soon for new designs"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
                  <img
                    src={design.imageUrl}
                    alt={design.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {design.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1">
                    {design.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {design.description || "Beautiful design for your needs"}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="text-2xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        ${design.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleOrder(design)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && filteredDesigns.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-bold text-purple-600">
                {filteredDesigns.length}
              </span>{" "}
              {filteredDesigns.length === 1 ? "design" : "designs"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Design;
