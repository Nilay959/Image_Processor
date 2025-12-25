import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { message } from "antd";

// 🔥 CHANGE THIS ONLY IF BACKEND URL CHANGES
const API = "https://image-processor-g0ls.onrender.com";

export default function GalleryPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
       

        setAuthorized(true);

        // ✅ FETCH USER IMAGES
        const res = await axios.get(`${API}/url/gallery`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setImages(res.data);
      } catch (err) {
        console.error("Error fetching images:", err);
        message.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  // 🗑️ DELETE IMAGE
  const deleteImage = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API}/url/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Image deleted successfully!");

      // Remove from UI instantly
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      message.error("Failed to delete image");
    }
  };

  return (
    <div className="bg-[#f7f7f7] min-h-screen">
      <Navbar />

      <section className="px-10 py-20">
        <h1 className="text-5xl font-light mb-6">
          Your Uploaded Images
        </h1>

        {/* IMAGE GRID */}
        <div
          className="grid gap-6 mt-10"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {images.length === 0 && (
            <p className="text-gray-500 text-lg">
              No images uploaded yet.
            </p>
          )}

          {images.map((img) => (
            <div
              key={img._id}
              className="relative bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteImage(img._id)}
                className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
              >
                ✕
              </button>

              {/* IMAGE DISPLAY */}
              {img.image?.startsWith("data") ? (
                <img
                  src={img.image}
                  alt="Uploaded"
                  className="w-full h-56 object-cover"
                />
              ) : (
                <img
                  src={`${API}/${img.image}`}
                  alt="Uploaded"
                  className="w-full h-56 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
