import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTshirt,
  FaShoppingCart,
  FaTag,
  FaFilter,
  FaSearch,
  FaCheckCircle,
  FaPalette,
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

const Fabrics = () => {
  const [fabrics, setFabrics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get selected design from navigation state (if coming from design page)
  const selectedDesign = location.state?.selectedDesign || null;

  const db = getFirestore(app);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const categoriesRef = collection(db, "fabricCategories");
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

  // Fetch fabrics
  const fetchFabrics = async () => {
    try {
      setLoading(true);
      const fabricsRef = collection(db, "fabrics");
      const q = query(fabricsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const fabricsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFabrics(fabricsData);
    } catch (error) {
      console.error("Error fetching fabrics:", error);
      toast.error("Failed to load fabrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFabrics();
  }, []);

  // Handle Order/Selection
  const handleOrder = (fabric) => {
    if (selectedDesign) {
      // Both design and fabric selected - add to cart
      const cartItem = {
        design: selectedDesign,
        fabric: fabric,
        totalPrice: selectedDesign.price + fabric.price,
        addedAt: new Date().toISOString(),
      };

      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      existingCart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(existingCart));

      toast.success(
        `Added to cart! Design: ${selectedDesign.name} + Fabric: ${fabric.name}`
      );
      navigate("/cart");
    } else {
      // Only fabric selected - redirect to designs
      toast.success(`Fabric "${fabric.name}" selected! Now choose a design.`);
      navigate("/design", { state: { selectedFabric: fabric } });
    }
  };

  // Filter fabrics
  const filteredFabrics = fabrics
    .filter(
      (fabric) =>
        selectedCategory === "all" || fabric.category === selectedCategory
    )
    .filter(
      (fabric) =>
        fabric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fabric.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaTshirt className="text-6xl mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              {selectedDesign
                ? "Choose Your Fabric"
                : "Premium Fabrics Collection"}
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              {selectedDesign
                ? `Select a fabric to pair with your ${selectedDesign.name} design`
                : "Choose from our finest quality fabrics for your perfect outfit"}
            </p>

            {/* Show selected design banner */}
            {selectedDesign && (
              <div className="mt-6 inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
                <FaCheckCircle className="text-green-300 text-xl" />
                <span className="font-semibold">
                  Selected Design: {selectedDesign.name}
                </span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  ${selectedDesign.price}
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
                placeholder="Search fabrics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <FaFilter className="text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 lg:flex-none px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                  ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              All ({fabrics.length})
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {category.name} (
                {fabrics.filter((f) => f.category === category.name).length})
              </button>
            ))}
          </div>
        </div>

        {/* Fabrics Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-6 text-lg">Loading fabrics...</p>
          </div>
        ) : filteredFabrics.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <FaTshirt className="text-7xl mx-auto mb-6 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No Fabrics Found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Check back soon for new fabrics"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFabrics.map((fabric) => (
              <div
                key={fabric.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-teal-100">
                  <img
                    src={fabric.imageUrl}
                    alt={fabric.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {fabric.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1">
                    {fabric.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                    {fabric.description || "High-quality fabric for your needs"}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="text-2xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                        ${fabric.price}
                      </p>
                      <p className="text-xs text-gray-500">per meter</p>
                    </div>
                    <button
                      onClick={() => handleOrder(fabric)}
                      className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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
        {!loading && filteredFabrics.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing{" "}
              <span className="font-bold text-blue-600">
                {filteredFabrics.length}
              </span>{" "}
              {filteredFabrics.length === 1 ? "fabric" : "fabrics"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Fabrics;
