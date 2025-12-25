import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { message } from "antd";

export default function GalleryPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [images, setImages] = useState([]);

  // AUTH CHECK + FETCH IMAGES
  useEffect(() => {
    const fetchImages = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await axios.get("https://image-processor-g0ls.onrender.com/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuthorized(true);

        const res = await axios.get("https://image-processor-g0ls.onrender.com/url/gallery", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setImages(res.data);
      } catch (err) {
        console.error("Error fetching images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!authorized) return <Navigate to="/login" replace />;

  // DELETE IMAGE FUNCTION
  const deleteImage = async (id) => {
    try {
      const token = localStorage.getItem("token");
      console.log(id);

      await axios.delete(`https://image-processor-g0ls.onrender.com/url/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Image deleted!");

      // Remove image from UI without reload
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
        <h1 className="text-5xl font-light leading-tight mb-6">
          Your Uploaded Images
        </h1>

        {/* IMAGE GALLERY GRID */}
        <div
          className="grid gap-6 mt-10"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}
        >
          {images.length === 0 && (
            <p className="text-gray-500 text-lg">No images uploaded yet.</p>
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

              {/* Base64 Image */}
              {img.image?.startsWith("data") && (
                <img src={img.image} className="w-full h-56 object-cover" />
              )}

              {/* Stored File URL */}
              {!img.image?.startsWith("data") && (
                <img
                  src={`http://localhost:8001/${img.image}`}
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
