import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext.js";
import ChatList from "../components/ChatList.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import { useNavigate } from "react-router-dom";

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  withCredentials: true,
});


export default function Chat() {
  const { user, logout } = useContext(AuthContext);   // ⬅ logout access
  const navigate = useNavigate();                     // ⬅ navigation access

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  // 🔥 STEP 1: Logout Function
  const handleLogout = () => {
    logout();          // remove user from context + localStorage
    navigate("/login"); // redirect to login
  };

  // Register user to socket
  useEffect(() => {
    socket.emit("addUser", user.userId);
  }, []);

  // Fetch all users
  useEffect(() => {
    api.get("/users/all").then((res) => setUsers(res.data.data));
  }, []);

  // Load messages for selected user
  const loadMessages = async (receiver) => {
    setSelectedUser(receiver);

    const res = await api.get(
      `/messages/${user.userId}/${receiver._id}`
    );

    const formatted = res.data.data.map((m) => ({
      text: m.message,
      self: m.senderId === user.userId,
    }));

    setMessages(formatted);
  };

  // Real-time receiving
  useEffect(() => {
    socket.on("receiveMessage", ({ senderId, message }) => {
      if (senderId === selectedUser?._id) {
        setMessages((prev) => [...prev, { text: message, self: false }]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedUser]);

  // Send message
  const sendMessage = async (text) => {
    if (!text || !selectedUser) return;

    // send real time
    socket.emit("sendMessage", {
      senderId: user.userId,
      receiverId: selectedUser._id,
      message: text,
    });

    // save to db
    await api.post("/messages/send", {
      senderId: user.userId,
      receiverId: selectedUser._id,
      message: text,
    });

    // update UI
    setMessages((prev) => [...prev, { text, self: true }]);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">

      {/* 🔥 STEP 2: Logout button in header */}
      <div className="p-4 bg-white shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Chat Application</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Chat Body */}
      <div className="flex flex-1">
        <ChatList
          users={users}
          selectedUser={selectedUser}
          openChat={loadMessages}
        />

        <ChatWindow
          messages={messages}
          selectedUser={selectedUser}
          sendMessage={sendMessage}
        />
      </div>

    </div>
  );
}
