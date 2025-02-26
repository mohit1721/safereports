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

            // ✅ Find User in Database (Admin or PoliceStation)
            let user = await User.findById(decoded.id).select("-password");
            if (!user) {
                user = await PoliceStation.findById(decoded.id).select("-password");
            }

            if (!user) {
                return res.status(401).json({ error: "Not authorized, user not found!" });
            }

            // ✅ Attach User to Request
            req.user = user;
            next();
        } else {
            return res.status(401).json({ error: "Not authorized, no token!" });
        }
    } catch (error) {
        res.status(401).json({ error: "Not authorized, token failed!" });
    }
};
// ✅ Admin Only Middleware
const adminOnly = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Access Denied! Admins only." });
    }
    next();
};

/*
GET /api/admin/reports?status=pending&policeStationName=XYZ&type=theft&reportName=robbery&page=1&limit=5
Authorization: Bearer <admin-token>

*/
const policeOnly = (req, res, next) => {
    if (req.user.role !== "POLICESTATION") {
        return res.status(403).json({ success: false, message: "Access Denied!Logged Police Station only." });
    }
    next();
};

/*
GET /api/police/reports?status=resolved&type=theft&reportName=burglary&page=1&limit=5
Authorization: Bearer <police-token>

*/
module.exports = { protect ,policeOnly, adminOnly};
