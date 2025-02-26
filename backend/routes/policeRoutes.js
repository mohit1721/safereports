const express = require("express");
const { getReportsForPolice, updateReportStatus } = require("../controllers/policeController");
const { protect, policeOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/reports", protect, policeOnly, getReportsForPolice); // ✅ Only Logged-in Police
router.put("/reports/status/:reportId", protect, policeOnly, updateReportStatus); // ✅ Only Police Can Update Status

module.exports = router;
