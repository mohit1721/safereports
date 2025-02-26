const PoliceStation = require("../models/policeStationModel");
const Report = require("../models/reportModel");
const bcrypt = require("bcryptjs");
const sendPoliceStationCredentials = require("../config/nodemailerConfig");

// ✅ Police Station Add Karne Ka Function
const addPoliceStation = async (req, res) => {
    try {
        // ✅ Sirf Admin Role Allow
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({
                success: false,
                error: "Access Denied! Only Admin can add Police Stations."
            });
        }

        const { name, email, latitude, longitude, district, state } = req.body;
// Generate a random password
const password = Math.random().toString(36).slice(-8); // Generates an 8-character random password
 //  Hash the password before saving
 const hashedPassword = await bcrypt.hash(password, 10);
        // ✅ Missing Fields Validation
        if (!name || !email || !latitude || !longitude || !district || !state) {
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
       

        // ✅ Naya Police Station Create
        const newStation = new PoliceStation({ name, email, password :hashedPassword ,role: "POLICESTATION", latitude, longitude, district, state });
        await newStation.save();
// Email bhejna police ko credentials ka
// await sendPoliceStationCredentials(email, "Police Account Created", `Your login credentials:\nEmail: ${email}\nPassword: ${password}`);
  // ✅ Send Police Station Credentials Email
  await sendPoliceStationCredentials(email, name, password);
        res.status(201).json({
            success: true,
            message: "Police Station added successfully!",
            data: newStation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


 

// const getAllReports = async (req, res) => {
//     try {
//         // ✅ Sirf Admin Role Allow
//         if (req.user.role !== "ADMIN") {
//             return res.status(403).json({ success: false, message: "Access Denied! Only Admin can view reports." });
//         }

//         // ✅ Filters from Query Params
//         const { status, policeStationName, type, reportName, page = 1, limit = 10 } = req.query;

//         let filter = {};

//         // ✅ Efficient Index-based Filtering
//         if (status) filter.status = status;  // Indexed
//         if (type) filter.type = type;        // Indexed

//         // ✅ Case-Insensitive Search for Report Title
//         if (reportName) filter.title = { $regex: reportName, $options: "i" }; 

//         // ✅ Police Station Name-based Filtering
//         if (policeStationName) {
//             const policeStation = await PoliceStation.findOne({ name: policeStationName }).select("_id").lean();
//             if (!policeStation) {
//                 return res.status(404).json({ success: false, message: "Police Station not found." });
//             }
//             filter.assignedStation = policeStation._id; // Indexed Field
//         }

//         // ✅ Paginated & Optimized Query
//         const reports = await Report.find(filter)
//             .populate("assignedStation", "name email district state") // Populate only necessary fields
//             .sort({ createdAt: -1 }) // ✅ Sort by Newest Reports First
//             .skip((page - 1) * limit)
//             .limit(parseInt(limit))
//             .lean(); // ✅ Converts Mongoose Documents into Plain Objects (Performance Boost)

//         // ✅ Response
//         res.status(200).json({
//             success: true,
//             totalReports: reports.length,
//             reports,
//         });

//     } catch (error) {
//         res.status(500).json({ success: false, message: "Error fetching reports", error: error.message });
//     }
// };

const getAllReports = async (req, res) => {
    try {
        // ✅ Sirf Admin Role Allow
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ success: false, message: "Access Denied! Only Admin can view reports." });
        }

        // ✅ Filters from Query Params
        const { status, policeStationName, type, reportName, page = 1, limit = 10 } = req.query;

        let filter = {};

        // ✅ Efficient Index-based Filtering
        if (status) filter.status = status;
        if (type) filter.type = type;
        if (reportName) filter.title = { $regex: reportName, $options: "i" };

        if (policeStationName) {
            const policeStation = await PoliceStation.findOne({ name: policeStationName }).select("_id").lean();
            if (!policeStation) {
                return res.status(404).json({ success: false, message: "Police Station not found." });
            }
            filter.assignedStation = policeStation._id;
        }

        // ✅ Fetch Reports
        let reports = await Report.find(filter)
            .populate("assignedStation", "name email district state")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        // ✅ Check if No Reports Found
        if (reports.length === 0) {
            // Agar koi filter apply nahi kiya gaya, toh **sabhi reports fetch karne ka ek aur chance do**
            if (Object.keys(filter).length === 0) {
                reports = await Report.find()
                    .populate("assignedStation", "name email district state")
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(parseInt(limit))
                    .lean();
            }

            // ✅ Agar ab bhi empty hai toh sahi response bhejo
            if (reports.length === 0) {
                return res.status(200).json({ 
                    success: true, 
                    message: "No reports found in the database.", 
                    totalReports: 0, 
                    reports: [] 
                });
            }
        }

        // ✅ Response
        res.status(200).json({
            success: true,
            totalReports: reports.length,
            reports,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching reports", error: error.message });
    }
};

const getAllPoliceStations = async (req, res) => {
    try {
        // ✅ Check if User is ADMIN
        if (!req.user || req.user.role !== "ADMIN") {
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

        res.status(200).json({ success: true, totalStations: policeStations.length, policeStations });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching police stations", error: error.message });
    }
};


module.exports = { getAllReports, addPoliceStation,getAllPoliceStations };
