const express = require("express");
// import { registerUser, loginUser } from "../controllers/authController.js";
const {registerUser, loginAdmin, loginUser, forgotPassword, resetPassword} = require ("../controllers/authController")
const rateLimit = require("express-rate-limit");
const router = express.Router();

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many password reset requests. Try again later." },
});

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many reset attempts. Try again later." },
});

router.post("/register", registerUser );
router.post("/login", loginUser);
router.post("/login/admin", loginAdmin);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);
module.exports = router;
