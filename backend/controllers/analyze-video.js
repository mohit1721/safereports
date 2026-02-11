// const express = require("express");
// const axios = require("axios");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const { uploadToCloudinary } = require("../config/cloudinaryConfig");

// const router = express.Router();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// // ✅ Convert video URL to Base64
// const convertToBase64 = async (fileUrl) => {
//     try {
//         const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
//         const base64Data = Buffer.from(response.data, "binary").toString("base64");
//         return `data:${response.headers["content-type"]};base64,${base64Data}`;
//     } catch (error) {
//         console.log("Error converting file to Base64:", error);
//         return null;
//     }
// };

// // ✅ Analyze Video Function
// // const analyzeVideo = async () => {
// // //  const files = req.files;
// // //      const videoUrl = files?.video
// // //                 ? await uploadToCloudinary (files.video, process.env.FOLDER_NAME)
// // //                 : null;
// //     console.log("frontend se aa rha[video] ->", req.body)

// //     const {videoUrl} = req.body
// //     if (!videoUrl) return res.status(400).json({ error: "Video URL is required" });

// //     const base64Video = await convertToBase64(videoUrl);
// //     if (!base64Video) return { title: "Unknown", category: "Other", description: "Failed to process video" };

// //     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
// //     const prompt = `Analyze this emergency situation video and respond in this exact format without any asterisks or bullet points:
// //     TITLE: Write a clear, brief title  
// //     CATEGORY: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)  
// //     DESCRIPTION: Write a clear, concise description`;

// //     const result = await model.generateContent([
// //         prompt,
// //         { inlineData: { data: base64Video.split(",")[1], mimeType: "video/mp4" } },
// //     ]);

// //     const text = await result.response.text();
// //     return extractAnalysis(text);
// // };

// // ✅ Extract AI Response
// const extractAnalysis = (text) => {
//     const titleMatch = text.match(/TITLE:\s*(.+)/);
//     const categoryMatch = text.match(/CATEGORY:\s*(.+)/);
//     const descMatch = text.match(/DESCRIPTION:\s*(.+)/);

//     return {
//         title: titleMatch ? titleMatch[1].trim() : "Unknown",
//         category: categoryMatch ? categoryMatch[1].trim() : "Other",
//         description: descMatch ? descMatch[1].trim() : "No description available",
//     };
// };
// const analyzeVideo = async (req, res) => {
//     try {
//       console.log("Frontend se aa raha data:", req.body);
  
//       const { video } = req.body; // Base64 string from frontend
  
//       if (!video) {
//         return res.status(400).json({ error: "No video data received!" });
//       }
  
//       // ✅ Convert Base64 to required format
//       const base64Video = video.split(",")[1]; // Remove data:video/mp4;base64, part
  
//       const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
//       const prompt = `Analyze this emergency situation video and respond in this exact format without any asterisks or bullet points:
//       TITLE: Write a clear, brief title  
//       CATEGORY: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)  
//       DESCRIPTION: Write a clear, concise description`;
  
//       const result = await model.generateContent([
//         prompt,
//         { inlineData: { data: base64Video, mimeType: "video/mp4" } },
//       ]);
  
//       const text = await result.response.text();
//       const extractedData = extractAnalysis(text);
  
//      return res.json(extractedData); // ✅ Send extracted data as JSON
//     } catch (error) {
//       console.log("Error analyzing video:", error);
//      return res.status(500).json({ error: "Internal Server Error" });
//     }
//   };
  
// module.exports ={analyzeVideo} 

// **9
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});

const extractAnalysis = (text = "") => {
  return {
    title: text.match(/TITLE:\s*(.+)/)?.[1]?.trim() || "",
    category: text.match(/CATEGORY:\s*(.+)/)?.[1]?.trim() || "",
    description: text.match(/DESCRIPTION:\s*(.+)/)?.[1]?.trim() || ""
  };
};

const analyzeVideo = async (req, res) => {
  try {
    const { video } = req.body;

    if (!video) {
      return res.status(200).json({ aiFailed: true });
    }

    const match = video.match(/^data:(.*);base64,(.*)$/);

    if (!match) {
      return res.status(200).json({ aiFailed: true });
    }

    const mimeType = match[1];
    const base64Data = match[2];

    const prompt = `
Analyze this emergency situation video and respond EXACTLY in format:

TITLE:
CATEGORY:
DESCRIPTION:
`;

    let result;

    try {
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType
          }
        }
      ]);
    } catch (aiError) {
      return res.status(200).json({ aiFailed: true });
    }

    const text = await result.response.text();
    const extracted = extractAnalysis(text);

    return res.json({
      aiFailed: false,
      ...extracted
    });

  } catch {
    return res.status(200).json({ aiFailed: true });
  }
};

module.exports = { analyzeVideo };