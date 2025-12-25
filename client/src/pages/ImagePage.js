import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { Navigate } from "react-router-dom";

// 🔥 BACKEND BASE URL (Render)
const API = "https://image-processor-g0ls.onrender.com";

export default function ImageEditor() {
  const [originalImage, setOriginalImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [editedImage, setEditedImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [operation, setOperation] = useState("");
  const [options, setOptions] = useState({});

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // ✅ CORRECT AUTH CHECK
        await axios.get(`${API}/url`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAuthorized(true);
      } catch (err) {
        console.error("Auth error:", err);
        localStorage.removeItem("token");
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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

  /* ================= HELPERS ================= */

  const fileToBase64 = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  /* ================= FILE SELECTION ================= */

  const handleChooseFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOriginalImage(URL.createObjectURL(file));
    const base64 = await fileToBase64(file);
    setBase64Image(base64);
    setEditedImage(null);
  };

  /* ================= UPLOAD ================= */

  const handleUploadToServer = async () => {
    if (!base64Image) return message.error("Choose an image first!");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/url/upload`,
        { images: [base64Image] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      message.error("Upload failed!");
    }
  };

  /* ================= PROCESS IMAGE ================= */

  const handleApplyOperation = async () => {
    if (!base64Image) return message.error("Choose an image first!");
    if (!operation) return message.error("Select an operation!");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API}/url/process`,
        {
          image: base64Image,
          operation,
          options,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditedImage(res.data.processedImage);
      message.success("Operation applied!");
    } catch (err) {
      console.error(err);
      message.error("Processing failed!");
    }
  };

  /* ================= DOWNLOAD ================= */

  const handleDownload = () => {
    if (!editedImage) return;

    const link = document.createElement("a");
    link.href = editedImage;
    link.download = "edited-image.png";
    link.click();
  };

  /* ================= UI ================= */

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <h1 className="text-5xl font-light mb-14 text-center">
        Image Editor
      </h1>

      {/* ACTION BAR */}
      <div className="mb-12 flex gap-4 justify-center">
        <label
          htmlFor="choose-file"
          className="px-6 py-2 rounded-full cursor-pointer bg-black text-white
                     hover:bg-gray-800 transition"
        >
          Choose File
        </label>

        <input
          id="choose-file"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChooseFile}
        />

        <button
          onClick={handleUploadToServer}
          className="px-6 py-2 rounded-full bg-blue-600 text-white
                     hover:bg-blue-700 transition"
        >
          Upload Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {/* ORIGINAL */}
        <div>
          <h2 className="font-semibold mb-3">Original Image</h2>
          <div className="h-80 bg-white rounded-xl flex items-center justify-center">
            {originalImage ? (
              <img src={originalImage} className="object-contain h-full" />
            ) : (
              <span className="text-gray-400">Choose an image</span>
            )}
          </div>
        </div>

        {/* CONTROLS */}
        <div>
          <h2 className="font-semibold mb-3">Edit Options</h2>
          <div className="bg-white p-6 rounded-xl space-y-4">
            <select
              className="border p-3 rounded w-full"
              value={operation}
              onChange={(e) => {
                setOperation(e.target.value);
                setOptions({});
              }}
            >
              <option value="">-- choose operation --</option>
              <option value="resize">Resize</option>
              <option value="crop">Crop</option>
              <option value="rotate">Rotate</option>
              <option value="flip">Flip</option>
              <option value="mirror">Mirror</option>
              <option value="grayscale">Grayscale</option>
              <option value="sepia">Sepia</option>
              <option value="watermark">Watermark</option>
              <option value="compress">Compress</option>
              <option value="format">Change Format</option>
            </select>

            {operation === "resize" && (
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Width" className="border p-2"
                  onChange={(e) => setOptions({ ...options, width: +e.target.value })} />
                <input placeholder="Height" className="border p-2"
                  onChange={(e) => setOptions({ ...options, height: +e.target.value })} />
              </div>
            )}

            {operation === "rotate" && (
              <input placeholder="Angle" className="border p-2 w-full"
                onChange={(e) => setOptions({ angle: +e.target.value })} />
            )}

            <button
              onClick={handleApplyOperation}
              className="w-full bg-blue-600 text-white py-3 rounded"
            >
              Apply Operation
            </button>
          </div>
        </div>

        {/* RESULT */}
        <div>
          <h2 className="font-semibold mb-3">Edited Image</h2>
          <div className="h-80 bg-white rounded-xl flex items-center justify-center">
            {editedImage ? (
              <img src={editedImage} className="object-contain h-full" />
            ) : (
              <span className="text-gray-400">No output yet</span>
            )}
          </div>

          {editedImage && (
            <button
              onClick={handleDownload}
              className="mt-4 w-full bg-green-600 text-white py-3 rounded"
            >
              Download Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
