import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function AdminDashboard() {
  const [images, setImages] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("pending"); // pending | approved | rejected

  // LOAD IMAGES
  const loadImages = async () => {
    const res = await api.get("/admin/images");
    setImages(res.data);
  };

  useEffect(() => {
    loadImages();
  }, []);

  const loadCategories = async () => {
    const res = await api.get("/admin/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    loadImages();
    loadCategories();
  }, []);

  // APPROVE IMAGE
  const approve = async (id) => {
    await api.put(`/admin/approve/${id}`);
    setImages(prev =>
      prev.map(img =>
        img.id === id ? { ...img, status: "approved" } : img
      )
    );
  };

  // REJECT IMAGE
  const reject = async (id) => {
    await api.put(`/admin/reject/${id}`);
    setImages(prev =>
      prev.map(img =>
        img.id === id ? { ...img, status: "rejected" } : img
      )
    );
  };

  // ADD CATEGORY
  const addCategory = async () => {
    if (!newCategory.trim()) return;
    await api.post("/admin/category", { name: newCategory });
    alert("Category added");
    setNewCategory("");
  };

  // SIDEBAR MENU
  const menu = [
    { label: "All Uploads", onClick: () => setActiveTab("pending") },
    { label: "Approved", onClick: () => setActiveTab("approved") },
    { label: "Rejected", onClick: () => setActiveTab("rejected") }
  ];

  // FILTER IMAGES BASED ON TAB
const filteredImages = images.filter(img => {
  const status = img.status ?? "pending";

  const statusMatch = status === activeTab;
  const categoryMatch =
    selectedCategory === "all" || img.category === selectedCategory;

  return statusMatch && categoryMatch;
});


  return (
    <DashboardLayout title="Admin Dashboard" menu={menu}>

      {/* ADD CATEGORY */}
      <div className="add-category">
        <input
          placeholder="New Category"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
        />
        <button type="button" onClick={addCategory}>
          Add Category
        </button>
      </div>

      {/* CATEGORY FILTER */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Filter by Category:
        </label>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="all">All Categories</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>


      {/* IMAGE GRID */}
      <div className="admin-grid">
        {filteredImages.map(img => {
          const status = img.status ?? "pending";

          return (
            <div key={img.id} className="card">

              <img
                src={`http://localhost:5000/uploads/${img.filename}`}
                alt=""
                onClick={() =>
                  setPreviewImage(
                    `http://localhost:5000/uploads/${img.filename}`
                  )
                }
              />

              <p><b>Student:</b> {img.studentName}</p>
              <p><b>Category:</b> {img.category}</p>

              <p>
                <b>Status:</b>{" "}
                <span className={status}>
                  {status.toUpperCase()}
                </span>
              </p>

      {status === "pending" && (
      <div className="admin-actions">
        <button
          className="approve-btn"
          onClick={() => approve(img.id)}
        >
          Approve
        </button>

        <button
          className="reject-btn"
          onClick={() => reject(img.id)}
        >
          Reject
        </button>
      </div>
      )}


            </div>
          );
        })}
      </div>

      {/* FULL IMAGE MODAL */}
      {previewImage && (
        <div
          className="image-modal"
          onClick={() => setPreviewImage(null)}
        >
          <img className="image-modal-img" src={previewImage} />
          <span className="close-btn">✕</span>
        </div>
      )}

    </DashboardLayout>
  );
}
