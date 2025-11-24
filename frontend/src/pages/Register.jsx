import { useForm } from "react-hook-form";
import api from "../api/api.js";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Register = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/register", data);
      console.log("Register success:", res.data);
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      setErrorMsg(msg); // show error inside UI
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        {/* 🔥 Error Message */}
        {errorMsg && (
          <p className="mb-4 text-red-600 text-center font-semibold">
            {errorMsg}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Name */}
          <input
            {...register("name")}
            type="text"
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded-lg text-black"
          />

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

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg text-lg font-semibold hover:bg-green-700"
          >
            Register
          </button>
        </form>

        {/* 🔥 Login Button */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};
