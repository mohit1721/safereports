const express = require("express");
const {getNearestPoliceStations,getPoliceStationById, getReportsForPolice, updateReportStatus } = require("../controllers/policeController");
const { protect, policeOnly } = require("../middleware/authMiddleware");

const router = express.Router();
const rateLimit = require("express-rate-limit");

const nearestPoliceStationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 20, // Max 20 requests per 1 minutes per IP
  message: { error: "Too many requests, please try again later" },
});
// ✅ Validation Middleware

  
router.get("/reports/police-station", protect, getReportsForPolice); // ✅ Only Logged-in Police
router.patch("/status/:reportId", protect, updateReportStatus); // ✅ Only Police Can Update Status
// Route to find nearest police stations
router.get("/nearest",nearestPoliceStationLimiter,getNearestPoliceStations);
router.get("/police/:id", getPoliceStationById);

module.exports = router;
