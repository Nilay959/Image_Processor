import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import axios from "axios";
import {message} from "antd";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log("IS FETCHING");

    const res = await axios.post("https://image-processor-g0ls.onrender.com/url/login", {
      email,
      password,
    });
    
    // console.log("Login response:", res);
    if(res.data.token ==="undefined"){
        message.error("Invalid credentials");
        navigate("/login");
    }else{
      message.success("User Loged in")
      localStorage.setItem("token", res.data.token);
      login({ email });
      navigate("/");
    }
  } catch (err) {
    console.error("Login Error:", err.response?.data || err.message);
    alert("Invalid email or password");
  }
};
  return (
    <AuthCard title="Welcome back" subtitle="Sign in to continue">
      <form onSubmit={handleSubmit} className="space-y-6">
        <AuthInput
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full rounded-full bg-black py-2 text-white text-sm hover:bg-zinc-800">
          Sign in
        </button>

        <div className="pt-2 text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-zinc-900 hover:underline hover:text-zinc-700 transition"
          >
            Register
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
