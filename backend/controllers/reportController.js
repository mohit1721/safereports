const Report = require("../models/reportModel.js");
const PoliceStation = require("../models/policeStationModel.js")
const {GoogleGenerativeAI} = require("@google/generative-ai")
const uploadFiles = require("../config/cloudinaryConfig.js")
// ✅ Create a new report
// export const createReport = async (req, res) => {
//   try {
//     const {
//       reportId,
//       type = "EMERGENCY",
//       specificType,
//       title,
//       description,
//       location,
//       latitude = null,
//       longitude = null,
//       image = null,
//       video = null,
//       status = "PENDING",
//     } = req.body;

//     const report = await Report.create({
//       reportId,
//       type,
//       reportType: specificType,
//       title,
//       description,
//       location,
//       latitude,
//       longitude,
//       image,
//       video,
//       status,
//     });

//     res.json({ success: true, reportId: report.reportId, message: "Report submitted successfully" });
//   } catch (error) {
//     console.error("Error creating report:", error);
//     res.status(500).json({ success: false, error: "Failed to submit report" });
//   }
// };

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// ✅ Function to Analyze Video
const analyzeVideo = async (video) => {
    const base64Data = video.split(",")[1];
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Analyze this emergency situation video and respond in this exact format without any asterisks or bullet points:

    TITLE: Write a clear, brief title  
    TYPE: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)  
    DESCRIPTION: Write a clear, concise description`;

    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                data: base64Data,
                mimeType: "video/mp4",
            },
        },
    ]);

    const text = await result.response.text();
    return extractAnalysis(text);
};

// ✅ Function to Analyze Image
const analyzeImage = async (image) => {
    const base64Data = image.split(",")[1];
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Analyze this emergency situation image and respond in this exact format without any asterisks or bullet points:

    TITLE: Write a clear, brief title  
    TYPE: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)  
    DESCRIPTION: Write a clear, concise description`;

    const result = await model.generateContent([
        prompt,
        {
            inlineData: {
                data: base64Data,
                mimeType: "image/jpeg",
            },
        },
    ]);

    const text = await result.response.text();
    return extractAnalysis(text);
};

// ✅ Extract AI Response (Common for Image & Video)
const extractAnalysis = (text) => {
    const titleMatch = text.match(/TITLE:\s*(.+)/);
    const typeMatch = text.match(/TYPE:\s*(.+)/);
    const descMatch = text.match(/DESCRIPTION:\s*(.+)/);

    return {
        title: titleMatch ? titleMatch[1].trim() : "Unknown",
        reportType: typeMatch ? typeMatch[1].trim() : "Other",
        description: descMatch ? descMatch[1].trim() : "No description available",
    };
};

// ✅ Function to Find Nearest Police Station
const findNearestStation = async (latitude, longitude) => {
  const nearestStation = await PoliceStation.findOne({
      location: {
          $near: {
              $geometry: { type: "Point", coordinates: [longitude, latitude] },
              $maxDistance: 5000, // 50 kmradius0
          },
      },
  });

  if (nearestStation) return nearestStation._id;

  // ✅ Default Central Police Station
  const centralStation = await PoliceStation.findOne({ isCentral: true });
  return centralStation ? centralStation._id : null;
};

// ✅ Controller to Create Report
 const createReport = async (req, res) => {
    try {
        const { title, description, location, latitude, longitude, assignedStation, files } = req.body;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: "At least one file is required" });
        }
 // ✅ Upload Files
 const fileUrls = await uploadFiles(req.files);
        let aiAnalysis = null;

        // ✅ Pehla Video ya Image Analyze Karo
        // const firstFile = fileUrls[0];
        // if (firstFile.fileType === "VIDEO") {
        //     aiAnalysis = await analyzeVideo(firstFile.url);
        // } else if (firstFile.fileType === "IMAGE") {
        //     aiAnalysis = await analyzeImage(firstFile.url);
        // }
// ✅ Pehla Video ya Image Analyze Karo
const firstFile = fileUrls[0]; // First uploaded file
if (firstFile.includes(".mp4") || firstFile.includes(".mov")) {
    aiAnalysis = await analyzeVideo(firstFile);
} else if (firstFile.includes(".jpg") || firstFile.includes(".png") || firstFile.includes(".jpeg")) {
    aiAnalysis = await analyzeImage(firstFile);
}
        // ✅ Police Station Decide Karo (Manual or Auto)
        let assignedPoliceStation = assignedStation;

        if (!assignedStation) {
            assignedPoliceStation = await findNearestStation(latitude, longitude);
        }

        // ✅ Agar nearest bhi na mile, fallback use karo
        if (!assignedPoliceStation) {
            return res.status(400).json({ error: "No nearby police station found" });
        }

        // ✅ MongoDB me Save Karna
        const report = new Report({
            reportId: `REP-${Date.now()}`,
            type: aiAnalysis ? aiAnalysis.reportType : "EMERGENCY",
            title: aiAnalysis ? aiAnalysis.title : title,
            description: aiAnalysis ? aiAnalysis.description : description,
            location,
            latitude,
            longitude,
            assignedStation: assignedPoliceStation,
            files : fileUrls,
            status: "PENDING",
        });

        await report.save();

        res.status(201).json({
            message: "Report created successfully",
            report,
            aiAnalysis,
        });
    } catch (error) {
        console.error("Report creation error:", error);
        res.status(500).json({ error: "Failed to create report" });
    }
};
 
// ✅ Get Report by ID (Publicly Accessible)
const getReportById = async (req, res) => {
  try {
      const { reportId } = req.params;

      // ✅ Report fetch karo
      const report = await Report.findById(reportId);
      if (!report) {
          return res.status(404).json({ success: false, error: "Report not found!" });
      }

      res.status(200).json({ success: true, report });
  } catch (error) {
      res.status(500).json({ success: false, error: "Error fetching the report", details: error.message });
  }
};

 
module.exports = { getReportById, createReport };
