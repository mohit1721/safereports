const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const PoliceStation = require("../models/policeStationModel");

const protect = async (req, res, next) => {
    try {
        let token;

        // ✅ Check if Authorization Header Exists and Starts with 'Bearer'
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];

            // ✅ Decode JWT Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // ✅ Find User[Admin] in Database (Admin or PoliceStation)
            let user = await User.findById(decoded.id).select("-password");

            if (user) {
                req.user = user;
                req.user.adminId = user._id; // ✅ Assign Admin ID
                req.user.role = "ADMIN"; // ✅ Ensure Role is Set
            } else {
                user = await PoliceStation.findById(decoded.id).select("-password");
                if (user) {
                    req.user = user;
                    req.user.policeStationId = user._id; // ✅ Assign Police Station ID
                    req.user.role = "POLICESTATION"; // ✅ Ensure Role is Set
                }
            }

            if (!req.user) {
                return res.status(401).json({ success: false, message: "Not authorized, user not found!" });
            }

            next();
        } else {
            return res.status(401).json({ success: false, message: "Not authorized, no token!" });
        }
    } catch (error) {
        res.status(401).json({ success: false, message: "Not authorized, token failed!", error: error.message });
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
