import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import {Link } from "react-router-dom";
import axios from "axios";
import {message} from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
   const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    console.log("IS FETCHING");

    const res = await axios.post("https://image-processor-g0ls.onrender.com/url/register", {
      email,
      password,
    });
    
    // console.log("Login Response:", res);
    if(res.data.message ==="undefined"){
        message.error("Invalid credentials");
        navigate("/register");
    }else{
      message.success("User Registered")
      // localStorage.setItem("token", res.data.token);
      // login({ email });
      navigate("/login");
    }
  } catch (err) {
    console.error("Login Error:", err.response?.data || err.message);
    alert("Eroor");
  }
};
  return (
    <AuthCard title="Create account" subtitle="Just a few details">
      <div className="space-y-6">
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
        <Link to ="/login">
        <button className="w-full rounded-full bg-black py-2 text-white text-sm hover:bg-zinc-800" onClick={handleSubmit}>
          
          Create account
        </button>
          </Link>
        
        <div className="pt-2 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-zinc-900 hover:underline hover:underline-offset-4 hover:text-zinc-700 transition"

        >
          Log in
        </Link>
      </div>
      </div>
    </AuthCard>
  );
}
