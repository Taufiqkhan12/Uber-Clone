import { Router } from "express";
import {
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  verifyEmail,
} from "../controllers/user.controller.js";
import { verfiyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/verify-email").post(verfiyJwt, verifyEmail);

router.route("/login").post(loginUser);

router.route("/profile").get(verfiyJwt, getUserProfile);

router.route("/logout").post(verfiyJwt, logoutUser);

export default router;
