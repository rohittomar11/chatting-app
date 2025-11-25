import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext.js";
import ChatList from "../components/ChatList.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import { useNavigate } from "react-router-dom";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  upgrade: false,
  withCredentials: true,
});

export default function Chat() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // 🔥 Mobile sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    socket.emit("addUser", user.userId);
  }, []);

  useEffect(() => {
    api.get("/users/all").then((res) => setUsers(res.data.data));
  }, []);

  const loadMessages = async (receiver) => {
    setSelectedUser(receiver);
    setIsSidebarOpen(false); // close sidebar on mobile

    const res = await api.get(`/messages/${user.userId}/${receiver._id}`);

    const formatted = res.data.data.map((m) => ({
      text: m.message,
      self: m.senderId === user.userId,
    }));

    setMessages(formatted);
  };

  useEffect(() => {
    socket.on("receiveMessage", ({ senderId, message }) => {
      if (senderId === selectedUser?._id) {
        setMessages((prev) => [...prev, { text: message, self: false }]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedUser]);

  const sendMessage = async (text) => {
    if (!text || !selectedUser) return;

    socket.emit("sendMessage", {
      senderId: user.userId,
      receiverId: selectedUser._id,
      message: text,
    });

    await api.post("/messages/send", {
      senderId: user.userId,
      receiverId: selectedUser._id,
      message: text,
    });

    setMessages((prev) => [...prev, { text, self: true }]);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">

      {/* 🔥 Header */}
      <div className="p-4 bg-white shadow-md flex justify-between items-center">
       <h1 className="text-xl font-bold text-black">Chat Application</h1>

        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden px-3 py-1 border rounded-lg"
          >
            ☰
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔥 MAIN CHAT AREA */}
      <div className="flex flex-1 relative overflow-hidden">

        {/* 🔥 Sidebar (Chat List) — responsive */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
            transition-transform duration-300 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 md:static md:w-1/4
          `}
        >
          <ChatList
            users={users}
            selectedUser={selectedUser}
            openChat={loadMessages}
          />
        </div>

        {/* Overlay (only mobile) */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-40 md:hidden"
          ></div>
        )}

        {/* 🔥 Chat Window */}
        <div className="flex-1 md:w-3/4 bg-gray-50">
          <ChatWindow
            messages={messages}
            selectedUser={selectedUser}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}
