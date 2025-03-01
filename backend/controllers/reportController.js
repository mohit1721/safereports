const Report = require("../models/reportModel.js");
const PoliceStation = require("../models/policeStationModel.js")
const {GoogleGenerativeAI} = require("@google/generative-ai")
const {uploadToCloudinary} = require("../config/cloudinaryConfig.js")
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
const formidable = require('formidable');

 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const convertToBase64 = async (fileUrl) => {
    try {
        const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
        const base64Data = Buffer.from(response.data, "binary").toString("base64");
        return `data:${response.headers["content-type"]};base64,${base64Data}`;
    } catch (error) {
        console.error("Error converting file to Base64:", error);
        return null;
    }
};
 
const analyzeVideo = async (videoUrl) => {
    const base64Video = await convertToBase64(videoUrl);
    if (!base64Video) return { title: "Unknown", reportType: "Other", description: "Failed to process video" };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Analyze this emergency situation video and respond in this exact format without any asterisks or bullet points:
    TITLE: Write a clear, brief title  
    CATEGORY: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)  
    DESCRIPTION: Write a clear, concise description`;

    const result = await model.generateContent([prompt, { inlineData: { data: base64Video.split(",")[1], mimeType: "video/mp4" } }]);

    const text = await result.response.text();
    return extractAnalysis(text);
};
 
const analyzeImage = async (imageUrl) => {
    const base64Image = await convertToBase64(imageUrl);
    if (!base64Image) return { title: "Unknown", reportType: "Other", description: "Failed to process image" };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Analyze this emergency situation image and respond in this exact format without any asterisks or bullet points:
    TITLE: Write a clear, brief title  
    CATEGORY: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)  
    DESCRIPTION: Write a clear, concise description`;

    const result = await model.generateContent([prompt, { inlineData: { data: base64Image.split(",")[1], mimeType: "image/jpeg" } }]);

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
        category: typeMatch ? typeMatch[1].trim() : "Other",
        description: descMatch ? descMatch[1].trim() : "No description available",
    };
};

// ✅ Function to Find Nearest Police Station



// single station
// const findNearestStation = async (latitude, longitude) => {
//   const nearestStation = await PoliceStation.findOne({
//       location: {
//           $near: {
//               $geometry: { type: "Point", coordinates: [longitude, latitude] },
//               $maxDistance: 500000, // 50,00 km radius
//           },
//       },
//   });

//   if (nearestStation) return nearestStation._id;

//   // ✅ Default Central Police Station
//   const centralStation = await PoliceStation.findOne({ isCentral: true });
//   return centralStation ? centralStation._id : null;
// };
// multiple stations

const findNearestStations = async (latitude, longitude) => {
    const nearbyStations = await PoliceStation.find({
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [longitude, latitude] },
                $maxDistance: 50000, // ✅ 50 km radius
            },
        },
    }).limit(5); // ✅ Max 5 nearest stations

    if (nearbyStations.length === 0) {
        // ✅ If no nearby station, fallback to Central Station
        const centralStation = await PoliceStation.findOne({ isCentral: true });
        if (!centralStation) {
            return res.status(500).json({ error: "No nearby police station or central police station found" });
        }
        return centralStation ? { nearestStation: centralStation._id, options: [] } : null;
    }

    // ✅ Auto-assign the first (nearest) station
    const nearestStation = nearbyStations[0]._id;

    return { nearestStation, options: nearbyStations };
};

const createReport = async (req, res) => {
    try {
      

        console.log("frontend data->" ,req.body);
        // const { location } = req.body;
        //   const parsedLocation = JSON.parse(location);

        console.log("frontend files->" ,req?.files);
        const { reportId, title, description, address, assignedStation, category } = req.body;
        const files = req.files;
        // const coordinates = JSON.parse(req.body.coordinates);

        // if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
        //     return res.status(400).json({success:false, message: "Valid coordinates [longitude, latitude] are required." });
        // }

        // const [lon, lat] = coordinates.map(Number);
        // if (isNaN(lat) || isNaN(lon)) {
        //     return res.status(400).json({ success:false, message: "Invalid coordinates values." });
        // }

        const imageUrl = files?.image
            ? await uploadToCloudinary(files.image, process.env.FOLDER_NAME)
            : null;
        const videoUrl = files?.video
            ? await uploadToCloudinary(files.video, process.env.FOLDER_NAME)
            : null;

        // ✅ AI Analysis (Only if image or video is provided)
        let aiAnalysis = { title, description, reportType: category };
        if (imageUrl) aiAnalysis = await analyzeImage(imageUrl);
        if (videoUrl) aiAnalysis = await analyzeVideo(videoUrl);

    //     // ✅ Police Station Decide Karo (Manual or Auto)
    //    // ✅ Get nearest stations
    //    let assignedPoliceStation = assignedStation;
    //    const { nearestStation, options } = await findNearestStations(lat, lon);

    //    if (!assignedStation) {
    //        assignedPoliceStation = nearestStation;
    //    }

    //    // ✅ If no station found, return options for frontend selection
    //    if (!assignedPoliceStation) {
    //        return res.status(200).json({
    //            message: "Multiple nearby police stations found. Please select one.",
    //            options, // 🔥 Send options to frontend
    //        });
    //    }
        // ✅ MongoDB me Save Karna
        const report = new Report({
            reportId,
             type: "EMERGENCY",
            title: aiAnalysis.title ||  title,
            description: aiAnalysis.description || description,
            category:aiAnalysis.category || category || "Other",
            address,
            assignedStation,
            image: imageUrl,
            video: videoUrl,
            status: "PENDING",
        });

        await report.save();
// ✅ PoliceStation Model me bhi Report add karo
await PoliceStation.findByIdAndUpdate(assignedStation, {
    $push: { reports: report._id }
});
       return res.status(201).json({
            success:true, message: "Report created successfully",
            report,
        });
    } catch (error) {
        console.error("Report creation error:", error);
       return res.status(500).json({ success:false, message: "Failed to create report" });
    }
};

// all reports...[filter by station**]



// ✅ Get Report by ID (Publicly Accessible)
const getReportById = async (req, res) => {
  try {
      const { reportId } = req.params;
console.log("report id->", reportId)
      // ✅ Report fetch karo
      const report = await Report.findOne({ reportId}).populate("assignedStation", "name state district email"); // ✅ Police Station ki details load karo

      if (!report) {
          return res.status(404).json({ success: false, message: "Report not found!" });
      }

     return res.status(200).json({ success: true, report, message: "Report fetched successfully" });
  } catch (error) {
     return res.status(500).json({ success: false, message: "Error fetching the report", details: error.message });
  }
};

 
module.exports = { getReportById, createReport };
