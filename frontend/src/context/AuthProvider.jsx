import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("chat-user")) || null
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem("chat-user", JSON.stringify(user));
      localStorage.setItem("chat-user-token", user.token);
    } else {
      localStorage.removeItem("chat-user");
      localStorage.removeItem("chat-user-token");
    }
  }, [user]);

  const login = (data) => setUser(data);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
