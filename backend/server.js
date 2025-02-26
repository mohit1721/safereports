const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const policeRoutes = require("./routes/policeRoutes.js");
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/police", policeRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
