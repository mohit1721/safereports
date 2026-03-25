const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db.js");
const contactRoutes = require("./routes/contactRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const policeRoutes = require("./routes/policeRoutes.js");
const analyzeRoutes = require("./routes/analyzeRoutes");

dotenv.config();

const app = express();
app.disable("x-powered-by");

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(
  cors({
    origin: ["http://localhost:5173", "https://safetoreport.vercel.app"],
    credentials: true,
  })
);

connectDB();

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.get("/api/health", (_, res) => {
  res.status(200).json({ success: true, message: "SafeReports API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/police", policeRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api", contactRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
