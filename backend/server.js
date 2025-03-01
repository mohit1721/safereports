const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const policeRoutes = require("./routes/policeRoutes.js");
const analyzeRoutes = require("./routes/analyzeRoutes")
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: "100mb" })); // ✅ Increase JSON payload limit
app.use(express.urlencoded({ limit: "100mb", extended: true })); // ✅ Increase URL-encoded payload limit

app.use(cors({ origin:[ "http://localhost:5173", "https://safetoreport.vercel.app"], credentials: true }));
// Database Connection
connectDB();
app.use(fileUpload({ //-_-   //,
  useTempFiles : true,
  // tempFileDir : '/tmp/'  //, --_--
})); 
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/police", policeRoutes);
app.use("/api/analyze",analyzeRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
