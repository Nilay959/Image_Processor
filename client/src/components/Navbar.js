import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();              
    navigate("/login");      
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="font-medium tracking-tight text-lg">
          GlassUI
        </Link>

        {/* Right Side Links */}
        <div className="flex items-center gap-8 text-sm text-zinc-500">
          
          {/* ------------------------- */}
          {/* USER LOGGED IN VIEW      */}
          {/* ------------------------- */}
          {user ? (
            <>
              {/* Upload Images Button */}
              <Link
                to="/upload"
                className="text-zinc-900 hover:underline hover:underline-offset-8 hover:text-zinc-700 transition"
              >
                Upload Images
              </Link>

              {/* All Images Button */}
              <Link
                to="/gallery"
                className="text-zinc-900 hover:underline hover:underline-offset-8 hover:text-zinc-700 transition"
              >
                All Images
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-zinc-900 hover:underline hover:underline-offset-8 hover:text-zinc-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* ------------------------- */}
              {/* USER NOT LOGGED IN VIEW  */}
              {/* ------------------------- */}
              <Link
                to="/"
                className="text-zinc-900 hover:underline hover:underline-offset-8 hover:text-zinc-700 transition"
              >
                Home
              </Link>

              <Link
                to="/login"
                className="text-zinc-900 hover:underline hover:underline-offset-8 hover:text-zinc-700 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="text-zinc-900 hover:underline hover:underline-offset-8 hover:text-zinc-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
