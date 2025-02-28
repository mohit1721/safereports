const express = require("express");
const { analyzeImage } = require("../controllers/analyze-image");
const { analyzeVideo } = require("../controllers/analyze-video");
const multer = require("multer");
const router = express.Router();
// ✅ Setup Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/image", upload.single("image"), analyzeImage); // ✅ Route for image analysis
router.post("/video", upload.single("video"), analyzeVideo); // ✅ Route for video analysis

module.exports = router;
