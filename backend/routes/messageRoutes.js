import express from "express";
import auth from "../middleware/auth.js";
import { sendMessage, getMessages } from "../controllers/messageController.js";

const router = express.Router();

// SEND MESSAGE
router.post("/send", auth, sendMessage);

// GET MESSAGES BETWEEN TWO USERS
router.get("/:senderId/:receiverId", auth, getMessages);

export default router;
