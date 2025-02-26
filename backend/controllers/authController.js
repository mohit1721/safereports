const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const PoliceStation = require("../models/policeStationModel");

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
  try {
    const { email, password } = req.body;

    // ✅ Check in both User and PoliceStation collections
    let user = await User.findOne({ email });
    if (!user) user = await PoliceStation.findOne({ email });

    // ❌ If user not found
    if (!user) return res.status(404).json({ error: "User not found" });
// Debugging hashed password
console.log("Entered Password:", password);
console.log("Stored Hashed Password:", user.password);
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

module.exports = {loginAdmin , registerUser, loginUser };
