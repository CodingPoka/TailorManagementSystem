import React, { useState, useEffect } from "react";
import { db } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaUserTie,
  FaEnvelope,
  FaPhone,
  FaTimes,
  FaMapMarkerAlt,
  FaStar,
} from "react-icons/fa";
import toast from "react-hot-toast";

const AllTailor = () => {
  const [tailors, setTailors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedTailor, setSelectedTailor] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    experience: "",
    specialization: "",
  });

  // Fetch all tailors from Firestore
  useEffect(() => {
    fetchTailors();
  }, []);

  const fetchTailors = async () => {
    try {
      setLoading(true);

      // Debug: First, let's see ALL users
      const usersRef = collection(db, "users");
      const allUsersSnapshot = await getDocs(usersRef);
      console.log("=== DEBUG: All users in database ===");
      console.log("Total users:", allUsersSnapshot.size);
      allUsersSnapshot.docs.forEach((doc) => {
        console.log(
          "User:",
          doc.id,
          "Role:",
          doc.data().role,
          "Name:",
          doc.data().name
        );
      });

      // Query users collection where role is "tailor"
      const q = query(usersRef, where("role", "==", "tailor"));
      const tailorsSnapshot = await getDocs(q);

      if (tailorsSnapshot.empty) {
        console.log("❌ No tailors found with role='tailor'");
        toast.error(
          "No tailors found in database. Existing tailors may need to re-register."
        );
        setTailors([]);
      } else {
        const tailorsList = tailorsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(`✅ Found ${tailorsList.length} tailors`);
        setTailors(tailorsList);
      }
    } catch (error) {
      console.error("Error fetching tailors:", error);
      toast.error("Failed to load tailors: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (tailor) => {
    setSelectedTailor(tailor);
    setEditFormData({
      name: tailor.name || "",
      email: tailor.email || "",
      phone: tailor.phone || "",
      address: tailor.address || "",
      experience: tailor.experience || "",
      specialization: tailor.specialization || "",
    });
    setEditModal(true);
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const tailorRef = doc(db, "users", selectedTailor.id);
      await updateDoc(tailorRef, editFormData);
      toast.success("Tailor updated successfully!");
      setEditModal(false);
      fetchTailors();
    } catch (error) {
      console.error("Error updating tailor:", error);
      toast.error("Failed to update tailor");
    }
  };

  // Handle delete button click
  const handleDeleteClick = (tailor) => {
    setSelectedTailor(tailor);
    setDeleteModal(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      await deleteDoc(doc(db, "users", selectedTailor.id));
      toast.success("Tailor deleted successfully!");
      setDeleteModal(false);
      fetchTailors();
    } catch (error) {
      console.error("Error deleting tailor:", error);
      toast.error("Failed to delete tailor");
    }
  };

  // Filter tailors based on search term
  const filteredTailors = tailors.filter(
    (tailor) =>
      tailor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tailor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tailor.phone?.includes(searchTerm) ||
      tailor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaUserTie className="text-purple-600" />
                All Tailors
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and view all registered tailors
              </p>
            </div>
            <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Total:</span>
              <span className="text-xl font-bold text-purple-600">
                {tailors.length}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        ) : filteredTailors.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaUserTie className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Tailors Found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "No tailors registered yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Specialization
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Experience
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTailors.map((tailor, index) => (
                      <tr
                        key={tailor.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-semibold">
                                {tailor.name?.charAt(0).toUpperCase() || "T"}
                              </span>
                            </div>
                            <span className="font-medium text-gray-800">
                              {tailor.name || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {tailor.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {tailor.phone || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                            {tailor.specialization || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-500" />
                            <span>{tailor.experience || "0"} years</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(tailor)}
                              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition transform hover:scale-105"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(tailor)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition transform hover:scale-105"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTailors.map((tailor, index) => (
                <div
                  key={tailor.id}
                  className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold text-lg">
                          {tailor.name?.charAt(0).toUpperCase() || "T"}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {tailor.name || "N/A"}
                        </h3>
                        <span className="text-xs text-gray-500">
                          Tailor #{index + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-blue-500" />
                      <span className="truncate">{tailor.email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaPhone className="text-green-500" />
                      <span>{tailor.phone || "N/A"}</span>
                    </div>
                    {tailor.specialization && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                          {tailor.specialization}
                        </span>
                      </div>
                    )}
                    {tailor.experience && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaStar className="text-yellow-500" />
                        <span>{tailor.experience} years experience</span>
                      </div>
                    )}
                    {tailor.address && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-red-500 mt-1" />
                        <span className="line-clamp-2">{tailor.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(tailor)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tailor)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Edit Modal */}
        {editModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Edit Tailor</h2>
                  <button
                    onClick={() => setEditModal(false)}
                    className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
                  >
                    <FaTimes size={20} />
                  </button>
                </div>
              </div>
              <form onSubmit={handleEditSubmit} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={editFormData.specialization}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          specialization: e.target.value,
                        })
                      }
                      placeholder="e.g., Suits, Dresses, Alterations"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      value={editFormData.experience}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          experience: e.target.value,
                        })
                      }
                      min="0"
                      placeholder="Years of experience"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={editFormData.address}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          address: e.target.value,
                        })
                      }
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <FaTrash className="text-red-600 text-2xl" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
                  Delete Tailor
                </h2>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{selectedTailor?.name}</span>?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Delete
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

export default AllTailor;
