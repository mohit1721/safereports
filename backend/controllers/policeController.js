const Report = require("../models/reportModel");

// ✅ Get Reports for Logged-in Police
const getReportsForPolice = async (req, res) => {
    try {
        // ✅ Sirf Police Role Allow
        if (req.user.role !== "POLICE") {
            return res.status(403).json({ success: false, message: "Access Denied! Only Police can view reports." });
        }

        // ✅ Filters from Query Params
        const { status, type, reportName, page = 1, limit = 10 } = req.query;

        let filter = { policeStation: req.user.policeStation }; // ✅ Sirf apne station ke reports dekh sakta hai

        // ✅ Filter by Status
        if (status) filter.status = status;

        // ✅ Filter by Report Type
        if (type) filter.type = type;

        // ✅ Filter by Report Name (Case-Insensitive Search)
        if (reportName) filter.name = { $regex: reportName, $options: "i" };

        // ✅ Paginated Query
        const reports = await Report.find(filter)
            .populate("policeStation", "name email district state") // Police Station Details
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

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
// ✅ Update Report Status (Only Logged-in Police)
const updateReportStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status } = req.body;

        // ✅ Check if the user is a Police
        if (req.user.role !== "POLICESTATION") {
            return res.status(403).json({ success: false, message: "Access Denied! Only Police can update report status." });
        }

        // ✅ Fetch Report & Ensure it Belongs to the Police Station
        const report = await Report.findById(reportId);
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found!" });
        }

        // ✅ Ensure Report Belongs to the Logged-in Police Station
        if (report.policeStation.toString() !== req.user.policeStation.toString()) {
            return res.status(403).json({ success: false, message: "You can only update reports assigned to your police station!" });
        }

        // ✅ Update Report Status
        report.status = status;
        await report.save();

        res.status(200).json({
            success: true,
            message: "Report status updated successfully!",
            updatedReport: report,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating report status", error: error.message });
    }
};
module.exports = { updateReportStatus , getReportsForPolice };
