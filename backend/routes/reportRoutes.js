const express = require("express");
const { createReport,  getReportById } = require("../controllers/reportController.js");
const { protect } = require("../middleware/authMiddleware.js");


const router = express.Router();

router.post("/create", createReport);
 
// 📌 Publicly Accessible Route
router.get("/:reportId", getReportById);
 
module.exports = router;