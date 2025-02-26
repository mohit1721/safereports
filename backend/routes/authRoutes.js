const express = require("express");
// import { registerUser, loginUser } from "../controllers/authController.js";
const {registerUser, loginAdmin, loginUser} = require ("../controllers/authController")
const router = express.Router();

router.post("/register", registerUser );
router.post("/login", loginUser);
router.post("/login/admin", loginAdmin);
module.exports = router;