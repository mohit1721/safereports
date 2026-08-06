const PoliceStation = require("../models/policeStationModel");
const Report = require("../models/reportModel");
const bcrypt = require("bcryptjs");
const sendPoliceStationCredentials = require("../config/nodemailerConfig");
const { generateResetToken } = require("./resetToken");

const FRONTEND_URL = process.env.FRONTEND_URL || "https://safetoreport.vercel.app";

// ✅ Police Station Add Karne Ka Function
const addPoliceStation = async (req, res) => {
    try {
        // ✅ Sirf Admin Role Allow
        if (req.user.role !== "ADMIN" && !req.user.adminId) {
            return res.status(403).json({
                success: false,
                error: "Access Denied! Only Admin can add Police Stations."
            });
        }

        const { name, email, location, district, state, isCentral } = req.body;
        
        // ✅ Missing Fields Validation
        if (!name || !email || !location || !district || !state) {
            return res.status(400).json({
                success: false,
                error: "All fields are required!"
            });
        }

        // ✅ Duplicate Email Check
        const existingStation = await PoliceStation.findOne({ email });
        if (existingStation) {
            return res.status(400).json({
                success: false,
                error: "Police Station already exists!"
            });
        }

        // ✅ Ensure Only One Central Police Station
        if (isCentral) {
            const existingCentral = await PoliceStation.findOne({ isCentral: true });
            if (existingCentral) {
                return res.status(400).json({
                    success: false,
                    error: "Only one Central Police Station can exist!"
                });
            }
        }

        // ✅ Validate Location Format
        if (!location.type || location.type !== "Point" || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
            return res.status(400).json({
                success: false,
                error: "Invalid location format! Location must be in GeoJSON format with type 'Point' and coordinates [longitude, latitude]."
            });
        }

        // ✅ Generate & Hash Password
        const password = Math.random().toString(36).slice(-8); // 8-character random password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ One-time password setup token (hashed in DB, raw token emailed)
        const { raw, hashed, expires } = await generateResetToken();

        // ✅ Naya Police Station Create
        const newStation = new PoliceStation({
            name,
            email,
            password: hashedPassword,
            role: "POLICESTATION",
            location,
            district,
            state,
            isCentral: isCentral || false,
            resetPasswordToken: hashed,
            resetPasswordExpire: new Date(expires)
        });

        await newStation.save();
        console.log("PS Credentials:",email , "&" ,password)
        // ✅ Send Police Station invite email (non-blocking: failures are logged, not thrown)
        const resetLink = `${FRONTEND_URL}/reset-password?token=${raw}&email=${encodeURIComponent(email)}`;
        const emailSent = await sendPoliceStationCredentials(email, name, resetLink);

        const response = {
            success: true,
            message: "Police Station added successfully!",
            data: newStation,
            emailSent
        };
        // If the invite email couldn't be sent, give the admin the link to relay manually
        if (!emailSent) response.resetLink = resetLink;

       return res.status(201).json(response);
    } catch (error) {
       return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

 
const getAllReports = async (req, res) => {
    try {
        // ✅ Sirf Admin Role Allow
        if (req.user.role !== "ADMIN" && !req.user.adminId) {
            return res.status(403).json({ success: false, message: "Access Denied! Only Admin can view reports." });
        }

        // ✅ Filters from Query Params
        const { search, status, type, page = 1, limit = 10 } = req.query;

        let filter = {};

        // ✅ Efficient Index-based Filtering
        if (status) filter.status = status;
        if (type) filter.type = type;
// 🔍 Search by Report Title OR Police Station Name
        if (search) {
            const policeStations = await PoliceStation.find({
                name: { $regex: search, $options: "i" }
            }).select("_id").lean();

            const policeStationIds = policeStations.map(station => station._id);

            filter.$or = [
                { title: { $regex: search, $options: "i" } }, // Report Title search
                { assignedStation: { $in: policeStationIds } } // Police Station Name search
            ];
        }

        // ✅ Fetch Reports
        let reports = await Report.find(filter)
            .populate("assignedStation", "name email district state")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();
// ✅ Total Count for Pagination
const totalReports = await Report.countDocuments(filter);
        // ✅ Response
       return res.status(200).json({
            success: true,
            totalReports,
            reports,
        });

    } catch (error) {
       return res.status(500).json({ success: false, message: "Error fetching reports", error: error.message });
    }
};


const getAllPoliceStations = async (req, res) => {
    try {
        // ✅ Check if User is ADMIN
        if (req.user.role !== "ADMIN" && !req.user.adminId) {
            return res.status(403).json({ success: false, message: "Access Denied! Only Admin can view police stations." });
        }

        const { search, district, state, page = 1, limit = 10 } = req.query;

        let filter = {};

        const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (search) {
            const regex = { $regex: escapeRegex(search), $options: "i" };
            filter.$or = [{ name: regex }, { email: regex }, { district: regex }, { state: regex }];
        }
        if (district) filter.district = { $regex: district, $options: "i" };
        if (state) filter.state = { $regex: state, $options: "i" };

        const totalStations = await PoliceStation.countDocuments(filter);
        const policeStations = await PoliceStation.find(filter)
            .sort({ name: 1 }) // ✅ Sort by name A-Z
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean(); // ✅ Convert Mongoose Docs to Plain Objects

       return res.status(200).json({ success: true, totalStations, policeStations });

    } catch (error) {
       return res.status(500).json({ success: false, message: "Error fetching police stations", error: error.message });
    }
};


module.exports = { getAllReports, addPoliceStation,getAllPoliceStations };
