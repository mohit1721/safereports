const Report = require("../models/reportModel");
const PoliceStation = require("../models/policeStationModel");

// ✅ Get Reports for Logged-in Police
const MAX_DISTANCE = 50000; // 50 km (fixed)

// const getReportsForPolice = async (req, res) => {
//     try {
//         // ✅ Sirf Police Role Allow
//         if (req.user.role !== "POLICESTATION") {
//             return res.status(403).json({ success: false, message: "Access Denied! Only Police can view reports." });
//         }
// // ✅ Validate Police Station ID
// if (!req.user.policeStationId) {
//     return res.status(400).json({ success: false, message: "Your account is not linked to any police station." });
// }
//         // ✅ Filters from Query Params
//         const { status, type, reportName, page = 1, limit = 10 } = req.query;

//         let filter = { assignedStation: req.user.policeStationId }; // ✅ Yeh field sahi hai

//         // ✅ Filter by Status
//         if (status) filter.status = status;

//         // ✅ Filter by Report Type
//         if (type) filter.type = type;

//         // ✅ Filter by Report Name (Case-Insensitive Search)
//         if (reportName) filter.title = { $regex: reportName, $options: "i" }; // ✅ `title` sahi field hai

//         // ✅ Paginated Query
//         const reports = await Report.find(filter)
//             .populate("assignedStation", "name email district state") // ✅ Sahi field populate kiya
//             .skip((page - 1) * limit)
//             .limit(parseInt(limit));

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

// ✅ Update Report Status (Only Logged-in Police)
// const updateReportStatus = async (req, res) => {
//     try {
//         const { reportId } = req.params;
//         const { status } = req.body;

//         // ✅ Check if the user is a Police
//         if (req.user.role !== "POLICESTATION" ) {
//             return res.status(403).json({ success: false, message: "Access Denied! Only Police can update report status." });
//         }
// // ✅ Validate Police Station ID
// // if (!req.user.policeStationId) {
// //     return res.status(400).json({ success: false, message: "Your account is not linked to any police station." });
// // }
//         // ✅ Fetch Report & Ensure it Belongs to the Police Station
//         const report = await Report.findById(reportId);
//         if (!report) {
//             return res.status(404).json({ success: false, message: "Report not found!" });
//         }

//         // ✅ Ensure Report Belongs to the Logged-in Police Station
//         if (report.assignedStation.toString() !== req.user.policeStationId.toString()) {
//             return res.status(403).json({ success: false, message: "You can only update reports assigned to your police station!" });
//         }

//         // ✅ Update Report Status
//         report.status = status;
//         await report.save();

//         res.status(200).json({
//             success: true,
//             message: "Report status updated successfully!",
//             updatedReport: report,
//         });

//     } catch (error) {
//         res.status(500).json({ success: false, message: "Error updating report status", error: error.message });
//     }
// };

const updateReportStatus = async (req, res) => {
  try {
      const { reportId } = req.params;
      const { status } = req.body;

      // ✅ Ensure Status is Provided
      if (!status) {
          return res.status(400).json({ success: false, message: "Status is required to update the report." });
      }

      // ✅ Check if the user is a Police
      if (!req.user || req.user.role !== "POLICESTATION") {
          return res.status(403).json({ success: false, message: "Access Denied! Only Police can update report status." });
      }

      // ✅ Validate Police Station ID
      if (!req.user.policeStationId) {
          return res.status(400).json({ success: false, message: "Your account is not linked to any police station." });
      }

      // ✅ Fetch Report & Ensure it Exists
      const report = await Report.findById(reportId);
      if (!report) {
          return res.status(404).json({ success: false, message: "Report not found!" });
      }

      // ✅ Ensure Report Belongs to the Logged-in Police Station
      if (!report.assignedStation || report.assignedStation.toString() !== req.user.policeStationId.toString()) {
          return res.status(403).json({ success: false, message: "You can only update reports assigned to your police station!" });
      }

      // ✅ Update Report Status
      report.status = status;
      await report.save();

      return res.status(200).json({
          success: true,
          message: "Report status updated successfully!",
          updatedReport: report,
      });

  } catch (error) {
      console.error("Error updating report status:", error.message);
      return res.status(500).json({ success: false, message: "Error updating report status", error: error.message });
  }
};

const getReportsForPolice = async (req, res) => {
  try {
    console.log("police get reports")
      if (req.user.role !== "POLICESTATION") {
          return res.status(403).json({ success: false, message: "Access Denied! Only Police can view reports." });
      }

      if (!req.user.policeStationId) {
          return res.status(400).json({ success: false, message: "Your account is not linked to any police station." });
      }

      const { status, type,category, reportName, page = 1, limit = 10 } = req.query;
      const filter = { assignedStation: req.user.policeStationId };

      if (status) filter.status = status;
      if (type) filter.type = type;
      if (category) filter.category = category;
      if (reportName) filter.title = { $regex: reportName, $options: "i" };

      const totalReports = await Report.countDocuments(filter);
      const reports = await Report.find(filter)
          .populate("assignedStation", "name email district state")
          .skip((page - 1) * limit)
          .limit(parseInt(limit)).sort({createdAt : -1})

    return res.status(200).json({
          success: true,
          totalReports,
          reports,
          message: `Reports fetched successfully for ${req.user.name} `
      });
  } catch (error) {
     return res.status(500).json({ success: false, message: "Error fetching reports", error: error.message });
  }
};
// GGOD
const getNearestPoliceStations = async (req, res) => {
    try {
      console.log("FE se aa rha ps ka req->", req.query); // ✅ Debug log
      const {latitude, longitude } = req.query;
      // const validateNearestQuery = [
      //   req.query("latitude").isFloat({ min: -90, max: 90 }).withMessage("Invalid latitude"),
      //   req.query("longitude").isFloat({ min: -180, max: 180 }).withMessage("Invalid longitude"),
      // ];
      if (!latitude || !longitude) {
        return res.status(400).json({ success:false, message: "Latitude and longitude are required" });
      }
  
      // Convert lat & long to float
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
   // ✅ Check if conversion worked
   if (isNaN(lat) || isNaN(lon)) {
    return res.status(400).json({ success:false, message: "Invalid latitude or longitude format" });
}
      // ✅ Find nearest police stations (50km radius, max 5 results)
      const nearbyStations = await PoliceStation.find({
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lon, lat] },
            $maxDistance: MAX_DISTANCE, // 50 km
          },
        },
      }).limit(5);
  
      if (nearbyStations.length === 0) {
        // ✅ Fallback to Central Station
        const centralStation = await PoliceStation.findOne({isCentral: true });
        if (!centralStation) {
          return res.status(404).json({ success:false, message: "No nearby police station or central police station found" });
        }
        return res.json({ nearestStation: centralStation, options: [] });
      }
  
      // ✅ Auto-assign the first (nearest) station
      // const nearestStation = nearbyStations[0]._id;
      const nearestStation = nearbyStations[0];

      return res.json({ nearestStation, options: nearbyStations });
    } catch (error) {
      console.log("Error fetching nearest police stations:", error);
     return res.status(500).json({success:false, message: "Error fetching nearest police stations" });
    }
  };


  const getPoliceStationById = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ success: false, message: "Police station ID is required" });
      }
  
      const policeStation = await PoliceStation.findById(id);
  
      if (!policeStation) {
        return res.status(404).json({ success: false, message: "Police station not found" });
      }
  
      res.json({ success: true, policeStation });
    } catch (error) {
      console.error("Error fetching police station by ID:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

module.exports = {getPoliceStationById , getNearestPoliceStations ,updateReportStatus , getReportsForPolice };
