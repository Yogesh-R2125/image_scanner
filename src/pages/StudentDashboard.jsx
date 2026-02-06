import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../components/DashboardLayout";

export default function StudentDashboard() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* ---------- LOAD DATA ---------- */
  const loadImages = async () => {
    const res = await api.get("/student/images");
    setImages(res.data);
  };

  const loadCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    loadImages();
    loadCategories();
  }, []);

  /* ---------- UPLOAD ---------- */
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

  /* ---------- SIDEBAR MENU ---------- */
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

      {/* ---------- UPLOAD BOX ---------- */}
      <div className="flex flex-wrap gap-3 mb-8">

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border px-3 py-2 rounded flex-1 min-w-[200px]"
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
          className="border px-3 py-2 rounded flex-1 min-w-[200px]"
        />

        <button
          onClick={uploadImage}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload
        </button>

      </div>

      {/* ---------- IMAGE GRID ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        {filteredImages.map(img => (
          <div
            key={img.id}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <img
              src={`http://localhost:5000/uploads/${img.filename}`}
              alt=""
              className="w-full h-56 object-cover"
            />

            <div className="p-4 space-y-1">
              <p><b>Category:</b> {img.category}</p>

              <p>
                <b>Status:</b>{" "}
                <span
                  className={`font-semibold ${
                    img.status === "approved"
                      ? "text-green-600"
                      : img.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {img.status}
                </span>
              </p>

              <p>
                <b>Uploaded:</b>{" "}
                {img.uploaded_at
                  ? new Date(img.uploaded_at).toLocaleString()
                  : "-"}
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
            </div>

          </div>
        ))}

      </div>

    </DashboardLayout>
  );
}
