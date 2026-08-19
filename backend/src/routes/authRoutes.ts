import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  getUsers,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", protect, logout);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.get("/users", protect, authorize("admin", "investigator"), getUsers);

export default router;
