import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import api from "../api/api.js";
import { AuthContext } from "../context/AuthContext.js";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      login(res.data);
      navigate("/chat");
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      setErrorMsg(msg); // show error on screen
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        {/* 🔥 Error Message */}
        {errorMsg && (
          <p className="mb-4 text-red-600 text-center font-semibold">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Email */}
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border rounded-lg text-black"
          />

          {/* Password */}
          <input
            {...register("password")}
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border rounded-lg text-black"
          />

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        {/* 🔥 Register Button */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};
