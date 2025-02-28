const PoliceStation = require("../models/policeStationModel");
const Report = require("../models/reportModel");
const bcrypt = require("bcryptjs");
const sendPoliceStationCredentials = require("../config/nodemailerConfig");

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

        // ✅ Naya Police Station Create
        const newStation = new PoliceStation({
            name,
            email,
            password: hashedPassword,
            role: "POLICESTATION",
            location,
            district,
            state,
            isCentral: isCentral || false
        });

        await newStation.save();
        console.log("PS Credentials:",email , "&" ,password)
        // ✅ Send Police Station Credentials Email
        await sendPoliceStationCredentials(email, name, password);

       return res.status(201).json({
            success: true,
            message: "Police Station added successfully!",
            data: newStation
        });
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

        // ✅ Response
       return res.status(200).json({
            success: true,
            totalReports: reports.length,
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

        const { district, state, page = 1, limit = 10 } = req.query;

        let filter = {};

        if (district) filter.district = { $regex: district, $options: "i" };
        if (state) filter.state = { $regex: state, $options: "i" };

        const policeStations = await PoliceStation.find(filter)
            .sort({ name: 1 }) // ✅ Sort by name A-Z
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean(); // ✅ Convert Mongoose Docs to Plain Objects

        if (policeStations.length === 0) {
            return res.status(200).json({ success: true, message: "No police stations found.", totalStations: 0, policeStations: [] });
        }

       return res.status(200).json({ success: true, totalStations: policeStations.length, policeStations });

    } catch (error) {
       return res.status(500).json({ success: false, message: "Error fetching police stations", error: error.message });
    }
};


module.exports = { getAllReports, addPoliceStation,getAllPoliceStations };
