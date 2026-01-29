import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import "../App.css";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
    
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Load all images
  const loadImages = async () => {
    try {
      const res = await api.get("/admin/images");
      setImages(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load images");
    }
  };

  // Approve image
  const approveImage = async (id) => {
    try {
      await api.put(`/admin/approve/${id}`);
      setImages(images.map(img =>
        img.id === id
          ? { ...img, approved: true, rejected: false }
          : img
      ));
    } catch (err) {
      console.error(err);
      alert("Approval failed");
    }
  };

  // Reject image
  const rejectImage = async (id) => {
    try {
      await api.put(`/admin/reject/${id}`);
      setImages(images.map(img =>
        img.id === id
          ? { ...img, approved: false, rejected: true }
          : img
      ));
    } catch (err) {
      console.error(err);
      alert("Rejection failed");
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <div className="page">
      {/* HEADER */}
      <div className="header">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* IMAGES */}
      <div className="card">
        {images.length === 0 && <p>No images uploaded yet</p>}

        <div className="image-grid">
          {images.map(img => (
            <div key={img.id} className="admin-image-card">
            <img
                src={`http://localhost:5000/uploads/${img.filename}`}
                alt="uploaded"
                className="clickable"
                onClick={() => setSelectedImage(img)}
            />

            <div className="uploaded-by">
                Uploaded by: <strong>Student {img.studentId}</strong>
            </div>

            <p className="category-text">
                Category: <strong>{img.category}</strong>
            </p>


              <div className="admin-actions">
                <span
                  className={`status ${
                    img.approved
                      ? "approved"
                      : img.rejected
                      ? "rejected"
                      : "pending"
                  }`}
                >
                  {img.approved
                    ? "Approved"
                    : img.rejected
                    ? "Rejected"
                    : "Pending"}
                </span>

                {!img.approved && !img.rejected && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => approveImage(img.id)}>
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => rejectImage(img.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL IMAGE MODAL */}
      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="close"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </span>

            <img
              src={`http://localhost:5000/uploads/${selectedImage.filename}`}
              alt="full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
