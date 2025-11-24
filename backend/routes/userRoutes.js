import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// protected route
router.get("/all", auth, getAllUsers);

export default router;
