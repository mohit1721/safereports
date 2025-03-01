const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const PoliceStation = require("../models/policeStationModel");

const protect = async (req, res, next) => {
    try {
        let token;
        // ✅ Ensure Authorization Header is Present
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        // 🔥 If No Token Found, Return Unauthorized
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized! No token provided." });
        }
        // console.log("police yehaan se ja rha..uska token ye->", token)

        // ✅ Decode JWT Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Check if User Exists in Admins
        let user = await User.findById(decoded.id).select("-password");
        if (user) {
            req.user = user;
            req.user.role = "ADMIN"; // ✅ Assign Role
            return next();
        } 

        // ✅ Check if User Exists in Police Stations
        user = await PoliceStation.findById(decoded.id).select("-password");
        if (user) {
            req.user = user;
            req.user.role = "POLICESTATION"; // ✅ Assign Role
            req.user.policeStationId = user._id; // ✅ Store ID
            return next();
        }

        // ❌ If No User Found, Return Unauthorized
        return res.status(401).json({ success: false, message: "Unauthorized! User not found." });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized! Invalid or expired token.",
            error: error.message
        });
    }
};
 


// ✅ Admin Only Middleware
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Access Denied! Admins only." });
    }
    next();
};

/*
GET /api/admin/reports?status=pending&policeStationName=XYZ&type=theft&reportName=robbery&page=1&limit=5
Authorization: Bearer <admin-token>
*/

const policeOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "POLICESTATION") {
        return res.status(403).json({ success: false, message: "Access Denied! Logged Police Station only." });
    }
    next();
};

/*
GET /api/police/reports?status=resolved&type=theft&reportName=burglary&page=1&limit=5
Authorization: Bearer <police-token>
*/

module.exports = { protect, policeOnly, adminOnly };
