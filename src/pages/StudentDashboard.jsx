import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";
import  "../App.css";

export default function StudentDashboard() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* ---------- load images ---------- */
  const loadImages = async () => {
    const res = await api.get("/student/images");
    setImages(res.data);
  };

  /* ---------- load categories ---------- */
  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    loadImages();
    loadCategories();
  }, []);

  /* ---------- upload image ---------- */
  const uploadImage = async () => {
    if (!file || !category) {
      alert("Select image and category");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("category", category);

    await api.post("/student/upload", formData);

    setFile(null);
    setCategory("");
    loadImages();
  };

  /* ---------- sidebar menu ---------- */
  const menu = [
    { label: "All", onClick: () => setSelectedCategory("All") },
    ...categories.map(c => ({
      label: c.name,
      onClick: () => setSelectedCategory(c.name)
    }))
  ];

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter(img => img.category === selectedCategory);

  return (
    <DashboardLayout title="Student Image Upload" menu={menu}>

      {/* ===== UPLOAD BOX ===== */}
      <div className="upload-box">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />

        <button onClick={uploadImage}>
          Upload
        </button>
      </div>

      {/* ===== IMAGE LIST ===== */}
      <div className="image-grid">
        {filteredImages.map(img => (
          <div key={img.id} className="card">
            <img
              src={`http://localhost:5000/uploads/${img.filename}`}
              alt=""
            />
            <p>{img.category}</p>
            <span>
              {img.approved
                ? "Approved"
                : img.rejected
                ? "Rejected"
                : "Pending"}
            </span>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
}
