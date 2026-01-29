import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function StudentDashboard() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  // fetch images
  const loadImages = async () => {
    try {
      const res = await api.get("/student/images");
      setImages(res.data);
    } catch (err) {
      console.error("Load images failed", err);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  // upload
  const uploadImage = async () => {
    if (!file || !category) {
      alert("Select category and image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("category", category);

      await api.post("/student/upload", formData);

      setFile(null);
      setCategory("");

      // refresh list
      loadImages();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ padding: 30 }}>

      <div className="header">
        <h2>Student Dashboard</h2>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <hr />

      <h3>Upload Image</h3>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="Nature">Nature</option>
        <option value="Objects">Objects</option>
        <option value="People">People</option>
        <option value="Technology">Technology</option>
      </select>

      <br /><br />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button id="upload-btn" onClick={uploadImage}>Upload</button>

      <hr />

      <h3>Your Images</h3>

      {images.length === 0 && <p>No images uploaded yet</p>}

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {images.map((img) => (
          <div key={img.id} style={{ border: "1px solid #ccc", padding: 10 }}>
            <img
              src={`http://localhost:5000/uploads/${img.filename}`}
              alt=""
              width="200"
              onClick={() =>
                window.open(
                  `http://localhost:5000/uploads/${img.filename}`,
                  "_blank"
                )
              }
            />
            <p>Category: {img.category}</p>
            <p>
              Status:{" "}
              {img.approved
                ? "Approved"
                : img.rejected
                ? "Rejected"
                : "Pending"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
