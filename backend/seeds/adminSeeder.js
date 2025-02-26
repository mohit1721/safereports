// const mongoose = require("mongoose");
// const bcryptjs = require("bcryptjs");
// const crypto = require("crypto");
// const dotenv = require("dotenv");
// const connectDB = require("../config/db");  // ✅ Use central DB connection
// const User = require("../models/userModel");
// dotenv.config();

// const createAdmin = async () => {
//   try {
//     await connectDB(); // ✅ Use the shared DB connection

//     const adminExists = await User.findOne({ role: "ADMIN" });
//     if (adminExists) {
//         console.log("⚠️ Admin already exists");
//         process.exit();
//       }
      
//     // if (!adminExists) {
    //   const randomPassword = crypto.randomBytes(8).toString("hex"); // 🔥 Generate random password
    // const hashedPassword = await bcryptjs.hash(randomPassword, 10);
//   //const hashedPassword = await bcryptjs.hash(randomPassword, 10);

//     console.log("Generated Plain Password:", randomPassword);
//     console.log("Hashed Password (Stored in DB):", hashedPassword);
    
//       const admin = new User({
//         name: "Super Admin",
//         email: process.env.ADMIN_EMAIL || "admin@1721.com", // 🔥 Use ENV
//         password: hashedPassword,
//         role: "ADMIN",
//       });

//       await admin.save();
//       console.log(`✅ Default Admin Created Successfully!`);
//       console.log(`🛑 Login using: ${admin.email} / ${randomPassword}`); // ❗ Show password once in logs
//     // } else {
//       // console.log("⚡ Admin Already Exists");
//     // }

//     mongoose.connection.close();
//   } catch (error) {
//     console.error("❌ Error creating admin:", error);
//     mongoose.connection.close();
//   }
// };

// createAdmin();
// **
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const crypto = require("crypto");
const dotenv = require("dotenv");
const connectDB = require("../config/db"); // ✅ Centralized DB connection
const User = require("../models/userModel");

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB(); // ✅ Ensure DB connection

    // ✅ Check if ADMIN already exists
    const adminExists = await User.findOne({ role: "ADMIN" });
    if (adminExists) {
      console.log("⚠️ Admin already exists. No need to create a new one.");
      return;
    }

    // ✅ Generate a secure random password
    const randomPassword = crypto.randomBytes(8).toString("hex"); // 🔥 Generate random password
    const hashedPassword = await bcryptjs.hash(randomPassword, 10);
    // console.log(" Password:", randomPassword);
    // console.log(" Hashed Password:", hashedPassword);

    // ✅ Define admin details
    const adminData = {
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL || "admin@1721.com",
      password: hashedPassword,
      role: "ADMIN",
    };

    // ✅ Create and save admin
    const admin = new User(adminData);
    await admin.save();

    console.log("✅ Default Admin Created Successfully!");
    console.log(`🛑 Admin Login Credentials -> Email: ${admin.email} | Password: ${randomPassword}`);

  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    mongoose.connection.close(); // ✅ Close DB connection
    process.exit(0); // ✅ Safe exit
  }
};

createAdmin();
