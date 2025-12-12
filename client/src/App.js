import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/GlassLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import ImagePage from "./pages/ImagePage";
import GalleryPage from "./pages/GalleryPage";

export default function App() {
  const { user } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/upload" element={<ImagePage/>}/>
        <Route path = "/gallery" element={<GalleryPage/>}/>
      </Routes>
    </Layout>
  );
}
