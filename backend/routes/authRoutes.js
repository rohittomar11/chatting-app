import { Router } from "express";
import { loginUser } from "../controllers/loginController.js";
import { registerUser } from "../controllers/registerController.js";
 const router=Router();
 router.post("/register",registerUser);
 router.post("/login",loginUser);
 export default router;
