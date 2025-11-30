import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import User from "./models/User.js"; // ⭐ IMPORTANT: Add this

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Create server
const server = createServer(app);

// Setup socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chatting-app-2-inyd.onrender.com"
    ],
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
    transports: ["websocket"],
  }
});

// Store online users
let onlineUsers = {};

// SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ⬆️ When frontend sends userId after login
  socket.on("addUser", async (userId) => {
    if (!userId) return;

    onlineUsers[userId] = socket.id;
    console.log("Online Users:", onlineUsers);

    // Mark user online in DB
    try {
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
      });

      // Notify all users
      io.emit("user-status-change", {
        userId,
        isOnline: true,
      });
    } catch (err) {
      console.log("Error setting user online:", err);
    }
  });

  // SEND MESSAGE
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = onlineUsers[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        message,
      });
    }
  });

  // USER DISCONNECTED
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    let userId = null;

    // Find which user disconnected
    for (let id in onlineUsers) {
      if (onlineUsers[id] === socket.id) {
        userId = id;
        delete onlineUsers[id];
        break;
      }
    }

    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          lastSeen: new Date(),
        });

        io.emit("user-status-change", {
          userId,
          isOnline: false,
          lastSeen: new Date(),
        });
      } catch (err) {
        console.log("Error updating lastSeen:", err);
      }
    }
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("Chat App Backend Running with Socket.io");
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
