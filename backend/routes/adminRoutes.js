const express = require("express");
const { addPoliceStation,getAllReports,getAllPoliceStations } = require("../controllers/adminController");
const { protect ,adminOnly } = require("../middleware/authMiddleware"); // ✅ Authentication Middleware

const router = express.Router();

// ✅ Police Station Add Route (Only Admin)
router.post("/add-police-station", protect,adminOnly,  addPoliceStation);
router.get("/reports/admin", protect, adminOnly, getAllReports); // ✅ Only Admin
router.get("/police-stations", protect, adminOnly, getAllPoliceStations); // ✅ Only Admin
module.exports = router;
