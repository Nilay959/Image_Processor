import { useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";
import { Navigate, useNavigate } from "react-router-dom";

export default function ImageEditor() {
  const navigate = useNavigate();

  const [originalImage, setOriginalImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [editedImage, setEditedImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [images, setImages] = useState([]);

  const [operation, setOperation] = useState("");
  const [options, setOptions] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  // AUTH + FETCH IMAGES
  useEffect(() => {
    const fetchImages = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await axios.get("http://localhost:8001/url/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAuthorized(true);

        const res = await axios.get("http://localhost:8001/url/gallery", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setImages(res.data);
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">Loading...</div>
    );

  if (!authorized) return <Navigate to="/login" replace />;

  // Convert File → Base64
  const fileToBase64 = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  // Choose file (NO UPLOAD YET)
  const handleChooseFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setOriginalImage(URL.createObjectURL(file));

    const base64 = await fileToBase64(file);
    setBase64Image(base64);
    setEditedImage(null); // reset previous result
  };

  // Upload Image to Backend
  const handleUploadToServer = async () => {
    if (!base64Image) return message.error("Choose an image first!");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8001/url/upload",
        { images: [base64Image] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success("Image uploaded successfully!");
    } catch (err) {
      console.error(err);
      message.error("Upload failed!");
    }
  };

  // Apply operation
  const handleApplyOperation = async () => {
  if (!base64Image) return message.error("Upload an image first!");
  if (!operation) return message.error("Select an operation!");

  try {
    const token = localStorage.getItem("token"); // <-- Add this

    console.log(options);

    const res = await axios.post(
      "http://localhost:8001/url/process",
      {
        image: base64Image,
        operation,
        options,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // <-- Add this
        },
      }
    );

    setEditedImage(res.data.processedImage);
    message.success("Operation applied!");
  } catch (err) {
    console.log(err);
    message.error("Processing failed!");
  }
};
  // Download Edited Image
  const handleDownload = () => {
    if (!editedImage) return;

    const link = document.createElement("a");
    link.href = editedImage;
    link.download = "edited-image.png";
    link.click();
  };

  return (
  <div className="p-10 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

    {/* HEADER */}
    <h1 className="text-5xl font-light mb-14 text-center tracking-wide">
      Image Editor
    </h1>

    {/* ACTION BAR */}
    <div className="mb-12 flex items-center gap-4 justify-center">
      <label
        htmlFor="choose-file"
        className="px-6 py-2 rounded-full cursor-pointer bg-black text-white 
                   hover:bg-gray-800 shadow-md hover:shadow-lg transition-all"
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
        className="px-6 py-2 rounded-full bg-blue-600 text-white shadow-md 
                   hover:bg-blue-700 hover:shadow-xl transition-all"
      >
        Upload Image
      </button>
    </div>

    {/* MAIN LAYOUT */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">

      {/* ORIGINAL IMAGE */}
      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Original Image</h2>

        <div className="w-full h-80 bg-white shadow-lg rounded-xl flex items-center 
                        justify-center overflow-hidden border border-gray-200">
          {originalImage ? (
            <img src={originalImage} className="object-contain w-full h-full" />
          ) : (
            <span className="text-gray-400">Choose an image</span>
          )}
        </div>
      </div>

      {/* OPERATIONS PANEL */}
      <div>
        <h2 className="font-semibold text-lg mb-3">Edit Options</h2>

        <div className="p-6 bg-white shadow-lg rounded-xl border border-gray-200 space-y-6">

          {/* Dropdown */}
          <select
            className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500"
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

          {/* Dynamic Input Fields */}
          <div className="space-y-4">
            {operation === "resize" && (
              <div className="grid grid-cols-2 gap-3">
                <input className="border p-2 rounded-lg" placeholder="Width"
                  onChange={(e) => setOptions({ ...options, width: Number(e.target.value) })} />
                <input className="border p-2 rounded-lg" placeholder="Height"
                  onChange={(e) => setOptions({ ...options, height: Number(e.target.value) })} />
              </div>
            )}

            {operation === "crop" && (
              <div className="grid grid-cols-2 gap-3">
                <input className="border p-2 rounded-lg" placeholder="Left"
                  onChange={(e) => setOptions({ ...options, left: Number(e.target.value) })} />
                <input className="border p-2 rounded-lg" placeholder="Top"
                  onChange={(e) => setOptions({ ...options, top: Number(e.target.value) })} />
                <input className="border p-2 rounded-lg" placeholder="Width"
                  onChange={(e) => setOptions({ ...options, width: Number(e.target.value) })} />
                <input className="border p-2 rounded-lg" placeholder="Height"
                  onChange={(e) => setOptions({ ...options, height: Number(e.target.value) })} />
              </div>
            )}

            {operation === "rotate" && (
              <input className="border p-2 w-full rounded-lg" placeholder="Angle (90)"
                onChange={(e) => setOptions({ angle: Number(e.target.value) })} />
            )}

            {operation === "watermark" && (
              <input className="border p-2 w-full rounded-lg" placeholder="Watermark text"
                onChange={(e) => setOptions({ text: e.target.value })} />
            )}

            {operation === "compress" && (
              <input type="number" className="border p-2 w-full rounded-lg"
                placeholder="Quality (10–100)"
                onChange={(e) => setOptions({ quality: Number(e.target.value) })} />
            )}

            {operation === "format" && (
              <select className="border p-2 w-full rounded-lg"
                onChange={(e) => setOptions({ format: e.target.value })}>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
              </select>
            )}
          </div>

          {/* APPLY BUTTON */}
          <button
            onClick={handleApplyOperation}
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md
                       hover:bg-blue-700 hover:shadow-xl active:scale-95 transition-all"
          >
            Apply Operation
          </button>
        </div>
      </div>

      {/* EDITED IMAGE */}
      <div className="space-y-3">
        <h2 className="font-semibold text-lg">Edited Image</h2>

        <div className="w-full h-80 bg-white shadow-lg rounded-xl flex items-center 
                        justify-center overflow-hidden border border-gray-200">
          {editedImage ? (
            <img src={editedImage} className="object-contain w-full h-full" />
          ) : (
            <span className="text-gray-400">No output yet</span>
          )}
        </div>

        {editedImage && (
          <button
            onClick={handleDownload}
            className="w-full bg-green-600 text-white py-3 rounded-lg shadow-md 
                       hover:bg-green-700 hover:shadow-xl transition-all"
          >
            Download Image
          </button>
        )}
      </div>

    </div>
  </div>
);

}
