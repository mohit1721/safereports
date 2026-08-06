const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const PoliceStation = require("../models/policeStationModel");
const sendEmail = require("../config/sendEmail");
const emailTemplatePasswordReset = require("../mailTemplates/emailTemplatePasswordReset");
const { generateResetToken, verifyResetToken } = require("./resetToken");

const FRONTEND_URL = process.env.FRONTEND_URL || "https://safetoreport.vercel.app";
// wait for this to happen
// Only an ADMIN can register another user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Ensure only an admin can create another user
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admin can register users" });
    }

    // ✅ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }


    // ✅ Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // ✅ Create a new user with the given role
    const user = await User.create({ name, email, password: hashedPassword, role });

    return res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ success: false, message: "Error in user registration", error: error.message });
  }
};

// Login function for both Users and Police Stations
const loginUser = async (req, res) => {
  console.log("fr se login req->");

  try {
    const { email, password } = req.body;
console.log("fr se login req->",email,password);
    // ✅ Check in both User and PoliceStation collections
    let user = await User.findOne({ email });
    if (!user) user = await PoliceStation.findOne({ email });

    // ❌ If user not found
    if (!user) return res.status(404).json({ error: "User not found" });
// Debugging hashed password
// console.log("Entered Password:", password);
// console.log("Stored Hashed Password:", user.password);
    // ✅ Check password
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Extended token validity
    );

    // ✅ Set Secure Cookie Options
    const cookieOptions = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 Days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    };

    // ✅ Remove password from response
    user.password = undefined;

    return res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Login failed", message: error.message });
  }
};
// NOT NEEDED
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check if admin exists
    const admin = await User.findOne({ email, role: "ADMIN" });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found!" });
    }

    // ✅ Verify password
    const isMatch = await bcryptjs.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("❌ Error in login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ✅ Forgot Password: generate one-time reset token (hashed) + email reset link
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    let record = await User.findOne({ email });
    if (!record) record = await PoliceStation.findOne({ email });

    // Always return the same message to avoid leaking which emails exist
    if (record) {
      const { raw, hashed, expires } = await generateResetToken();
      record.resetPasswordToken = hashed;
      record.resetPasswordExpire = new Date(expires);
      await record.save();

      const resetLink = `${FRONTEND_URL}/reset-password?token=${raw}&email=${encodeURIComponent(email)}`;
      await sendEmail(email, "🔒 Reset Your Password — SafeReport", emailTemplatePasswordReset(record.name || email, resetLink));
    }

    return res.status(200).json({
      success: true,
      message: "If an account exists for this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
};

// ✅ Reset Password: verify one-time token, set new password, clear token
const resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;
    if (!token || !email || !newPassword) {
      return res.status(400).json({ success: false, message: "Token, email and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    let record = await User.findOne({ email });
    if (!record) record = await PoliceStation.findOne({ email });

    const check = await verifyResetToken(record, token);
    if (!check.ok) {
      const message =
        check.reason === "EXPIRED"
          ? "This reset link has expired. Please request a new one."
          : "This reset link is invalid or has already been used.";
      return res.status(400).json({ success: false, message });
    }

    record.password = await bcryptjs.hash(newPassword, 10);
    record.resetPasswordToken = null;
    record.resetPasswordExpire = null;
    await record.save();

    return res.status(200).json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
};

module.exports = { loginAdmin, registerUser, loginUser, forgotPassword, resetPassword };
