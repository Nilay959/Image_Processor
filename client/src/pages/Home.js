import { Sparkles, Zap, Shield } from "lucide-react";
import { useEffect, useState, } from "react";
import axios from "axios";
import { Navigate,Link } from "react-router-dom";

export default function Home() {
  // const [loading, setLoading] = useState(true);
  // const [authorized, setAuthorized] = useState(false);


  // useEffect(() => {
  //   const verifyAndFetch = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const res = await axios.get("http://localhost:8001/url/", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       // console.log("API Response:", res);
  //       setAuthorized(true);
  //     } catch (err) {
  //       console.error("Auth failed:", err);
  //       localStorage.removeItem("token");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   verifyAndFetch();
  // }, [authorized]);

  // if (loading) {
  //   return (
  //     <div className="h-screen flex items-center justify-center">
  //       Verifying...
  //     </div>
  //   );
  // }

  // if (!authorized) {
  //   return <Navigate to="/login" replace />;
  // }
  

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-24">
      {/* HERO */}
      <section className="space-y-8">
        <h1 className="text-6xl md:text-7xl font-light tracking-tight">
          Modern <br /> interface.
        </h1>
        <p className="text-zinc-500 max-w-md leading-relaxed">
          Minimal UI built for clarity, speed, and calm experiences.
        </p>
        <Link to ="/upload">
        <button className="rounded-full border border-black px-6 py-2 text-sm hover:bg-black hover:text-white transition">
          Get started
        </button>
        </Link>
      </section>


      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-12">
        <Feature icon={<Sparkles size={18} />} title="Design" />
        <Feature icon={<Zap size={18} />} title="Performance" />
        <Feature icon={<Shield size={18} />} title="Security" />
      </section>
    </div>
  );
}

function Feature({ icon, title }) {
  return (
    <div className="space-y-4">
      {icon}
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">
        Clean, thoughtful details that focus on usability.
      </p>
    </div>
  );
}
