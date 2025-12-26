import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaTimes,
  FaEdit,
  FaTrash,
  FaUpload,
  FaPalette,
  FaTag,
} from "react-icons/fa";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "../config/firebaseConfig";
import toast from "react-hot-toast";

const AdminDesign = () => {
  const [categories, setCategories] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [editingDesign, setEditingDesign] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);

  const [designForm, setDesignForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
  });

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
      toast.error("Failed to load categories");
    }
  };

  // Fetch designs
  const fetchDesigns = async () => {
    try {
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
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchDesigns()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Add Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      await addDoc(collection(db, "designCategories"), {
        name: categoryName,
        createdAt: new Date().toISOString(),
      });
      toast.success("Category added successfully!");
      setCategoryName("");
      setShowCategoryModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteDoc(doc(db, "designCategories", id));
        toast.success("Category deleted successfully!");
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
      }
    }
  };

  // Upload Image to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setImageUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    formData.append("folder", "tailor_designs");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      if (data.secure_url) {
        setDesignForm({ ...designForm, imageUrl: data.secure_url });
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("No image URL returned");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        error.message === "Upload failed"
          ? "Upload failed. Please enable unsigned uploads in Cloudinary settings."
          : `Failed to upload image: ${error.message}`
      );
    } finally {
      setImageUploading(false);
    }
  };

  // Add Design
  const handleAddDesign = async (e) => {
    e.preventDefault();

    if (
      !designForm.name ||
      !designForm.category ||
      !designForm.price ||
      !designForm.imageUrl
    ) {
      toast.error("Please fill all required fields and upload an image");
      return;
    }

    try {
      await addDoc(collection(db, "designs"), {
        name: designForm.name,
        category: designForm.category,
        price: parseFloat(designForm.price),
        description: designForm.description,
        imageUrl: designForm.imageUrl,
        createdAt: new Date().toISOString(),
      });

      toast.success("Design added successfully!");
      setDesignForm({
        name: "",
        category: "",
        price: "",
        description: "",
        imageUrl: "",
      });
      setShowDesignModal(false);
      fetchDesigns();
    } catch (error) {
      console.error("Error adding design:", error);
      toast.error("Failed to add design");
    }
  };

  // Edit Design
  const handleEditDesign = (design) => {
    setEditingDesign(design);
    setDesignForm({
      name: design.name,
      category: design.category,
      price: design.price.toString(),
      description: design.description || "",
      imageUrl: design.imageUrl,
    });
    setShowDesignModal(true);
  };

  // Update Design
  const handleUpdateDesign = async (e) => {
    e.preventDefault();

    if (
      !designForm.name ||
      !designForm.category ||
      !designForm.price ||
      !designForm.imageUrl
    ) {
      toast.error("Please fill all required fields and upload an image");
      return;
    }

    try {
      await updateDoc(doc(db, "designs", editingDesign.id), {
        name: designForm.name,
        category: designForm.category,
        price: parseFloat(designForm.price),
        description: designForm.description,
        imageUrl: designForm.imageUrl,
        updatedAt: new Date().toISOString(),
      });

      toast.success("Design updated successfully!");
      setDesignForm({
        name: "",
        category: "",
        price: "",
        description: "",
        imageUrl: "",
      });
      setEditingDesign(null);
      setShowDesignModal(false);
      fetchDesigns();
    } catch (error) {
      console.error("Error updating design:", error);
      toast.error("Failed to update design");
    }
  };

  // Delete Design
  const handleDeleteDesign = async (id) => {
    if (window.confirm("Are you sure you want to delete this design?")) {
      try {
        await deleteDoc(doc(db, "designs", id));
        toast.success("Design deleted successfully!");
        fetchDesigns();
      } catch (error) {
        console.error("Error deleting design:", error);
        toast.error("Failed to delete design");
      }
    }
  };

  // Filter designs by category
  const filteredDesigns =
    selectedCategory === "all"
      ? designs
      : designs.filter((design) => design.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaPalette className="text-purple-600" />
                Design Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage categories and designs
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCategoryModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 shadow-md"
              >
                <FaPlus /> Add Category
              </button>
              <button
                onClick={() => setShowDesignModal(true)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all flex items-center gap-2 shadow-md"
              >
                <FaPlus /> Add Design
              </button>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaTag className="text-blue-600" />
            Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedCategory === "all"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Designs ({designs.length})
            </button>
            {categories.map((category) => (
              <div key={category.id} className="relative group">
                <button
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === category.name
                      ? "bg-purple-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {category.name} (
                  {designs.filter((d) => d.category === category.name).length})
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Designs Grid */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {selectedCategory === "all"
              ? "All Designs"
              : `${selectedCategory} Designs`}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading designs...</p>
            </div>
          ) : filteredDesigns.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FaPalette className="text-6xl mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No designs found</p>
              <p className="text-sm">Add your first design to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDesigns.map((design) => (
                <div
                  key={design.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={design.imageUrl}
                      alt={design.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditDesign(design)}
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteDesign(design.id)}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      {design.name}
                    </h3>
                    <p className="text-sm text-purple-600 font-semibold mb-2">
                      {design.category}
                    </p>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {design.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        ${design.price}
                      </span>
                      <span className="text-xs text-gray-500">per design</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Add New Category
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g., Traditional, Modern, Casual"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Design Modal */}
      {showDesignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {editingDesign ? "Edit Design" : "Add New Design"}
              </h3>
              <button
                onClick={() => {
                  setShowDesignModal(false);
                  setEditingDesign(null);
                  setDesignForm({
                    name: "",
                    category: "",
                    price: "",
                    description: "",
                    imageUrl: "",
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form
              onSubmit={editingDesign ? handleUpdateDesign : handleAddDesign}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Design Name *
                  </label>
                  <input
                    type="text"
                    value={designForm.name}
                    onChange={(e) =>
                      setDesignForm({ ...designForm, name: e.target.value })
                    }
                    placeholder="e.g., Royal Wedding Design"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Category *
                  </label>
                  <select
                    value={designForm.category}
                    onChange={(e) =>
                      setDesignForm({
                        ...designForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={designForm.price}
                  onChange={(e) =>
                    setDesignForm({ ...designForm, price: e.target.value })
                  }
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={designForm.description}
                  onChange={(e) =>
                    setDesignForm({
                      ...designForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the design..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Design Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {designForm.imageUrl ? (
                    <div className="relative">
                      <img
                        src={designForm.imageUrl}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setDesignForm({ ...designForm, imageUrl: "" })
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <FaUpload className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">
                        {imageUploading
                          ? "Uploading..."
                          : "Upload design image"}
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="design-image"
                        disabled={imageUploading}
                      />
                      <label
                        htmlFor="design-image"
                        className={`inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer ${
                          imageUploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {imageUploading ? "Uploading..." : "Choose File"}
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDesignModal(false);
                    setEditingDesign(null);
                    setDesignForm({
                      name: "",
                      category: "",
                      price: "",
                      description: "",
                      imageUrl: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={imageUploading}
                  className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingDesign ? "Update Design" : "Add Design"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDesign;
