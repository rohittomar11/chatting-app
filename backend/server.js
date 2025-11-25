import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";

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

// Create server for socket.io
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

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Save userId with socketId
  socket.on("addUser", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("Online Users:", onlineUsers);
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

  // User disconnected
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove user from onlineUsers
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        break;
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

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
