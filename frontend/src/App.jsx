import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Chat from "./pages/Chat";
import { ProtectedRoute } from "./ProtectedRoute";

function App() {
  console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
  return (
    <Routes>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/register" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      {/* Optional: redirect unknown routes */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
