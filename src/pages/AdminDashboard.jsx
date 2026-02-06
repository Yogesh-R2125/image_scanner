import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function AdminDashboard() {
  const [images, setImages] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("pending");

  /* ---------- LOAD DATA ---------- */
  const loadImages = async () => {
    const res = await api.get("/admin/images");
    setImages(res.data);
  };

  const loadCategories = async () => {
    const res = await api.get("/admin/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    loadImages();
    loadCategories();
  }, []);

  /* ---------- APPROVE ---------- */
  const approve = async (id) => {
    await api.put(`/admin/approve/${id}`);
    setImages(prev =>
      prev.map(img =>
        img.id === id ? { ...img, status: "approved" } : img
      )
    );
  };

  /* ---------- REJECT ---------- */
  const reject = async (id) => {
    await api.put(`/admin/reject/${id}`);
    setImages(prev =>
      prev.map(img =>
        img.id === id ? { ...img, status: "rejected" } : img
      )
    );
  };

  /* ---------- ADD CATEGORY ---------- */
  const addCategory = async () => {
    if (!newCategory.trim()) return;

    await api.post("/admin/category", { name: newCategory });
    alert("Category added");
    setNewCategory("");
    loadCategories();
  };

  /* ---------- SIDEBAR MENU ---------- */
  const menu = [
    { label: "All Uploads", onClick: () => setActiveTab("pending") },
    { label: "Approved", onClick: () => setActiveTab("approved") },
    { label: "Rejected", onClick: () => setActiveTab("rejected") }
  ];

  /* ---------- FILTER ---------- */
  const filteredImages = images.filter(img => {
    const status = img.status ?? "pending";
    const statusMatch = status === activeTab;
    const categoryMatch =
      selectedCategory === "all" || img.category === selectedCategory;

    return statusMatch && categoryMatch;
  });

  return (
    <DashboardLayout title="Admin Dashboard" menu={menu}>

      {/* ---------- ADD CATEGORY ---------- */}
      <div className="flex gap-3 mb-6">
        <input
          placeholder="New Category"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
        />

        <button
          onClick={addCategory}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      {/* ---------- FILTER ---------- */}
      <div className="flex items-center gap-3 mb-8">
        <label className="font-semibold">Filter Category:</label>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All Categories</option>

          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* ---------- GRID ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {filteredImages.map(img => {
          const status = img.status ?? "pending";

          return (
            <div
              key={img.id}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <img
                src={`http://localhost:5000/uploads/${img.filename}`}
                alt=""
                className="w-full h-56 object-cover cursor-pointer"
                onClick={() =>
                  setPreviewImage(
                    `http://localhost:5000/uploads/${img.filename}`
                  )
                }
              />

              <div className="p-4 space-y-1">
                <p><b>Student:</b> {img.studentName}</p>
                <p><b>Category:</b> {img.category}</p>

                <p>
                  <b>Uploaded:</b>{" "}
                  {new Date(img.uploaded_at).toLocaleString()}
                </p>

                {img.approved_at && (
                  <p>
                    <b>Approved:</b>{" "}
                    {new Date(img.approved_at).toLocaleString()}
                  </p>
                )}

                {img.rejected_at && (
                  <p>
                    <b>Rejected:</b>{" "}
                    {new Date(img.rejected_at).toLocaleString()}
                  </p>
                )}

                <p>
                  <b>Status:</b>{" "}
                  <span
                    className={`font-semibold ${
                      status === "approved"
                        ? "text-green-600"
                        : status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {status.toUpperCase()}
                  </span>
                </p>

                {status === "pending" && (
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => approve(img.id)}
                      className="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => reject(img.id)}
                      className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------- IMAGE MODAL ---------- */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            className="max-h-[90vh] max-w-[90vw] rounded"
          />
        </div>
      )}

    </DashboardLayout>
  );
}
