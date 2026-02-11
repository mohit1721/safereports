// const express = require("express");
// const axios = require("axios");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const { uploadToCloudinary } = require("../config/cloudinaryConfig");

// const router = express.Router();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

// const extractAnalysis = (text) => {
//     const titleMatch = text.match(/TITLE:\s*(.+)/);
//     const typeMatch = text.match(/CATEGORY:\s*(.+)/);
//     const descMatch = text.match(/DESCRIPTION:\s*(.+)/);

//     return {
//         title: titleMatch ? titleMatch[1].trim() : "Unknown",
//         category: typeMatch ? typeMatch[1].trim() : "Other",
//         description: descMatch ? descMatch[1].trim() : "No description available",
//     };
// };

// // const analyzeImage = async (req, res) => {
// //     //   const files = req.files;
// //     //   const imageUrl = files?.image
// //     //             ? await uploadToCloudinary(files.image, process.env.FOLDER_NAME)
// //     //             : null;
// //     const {image} = req.body
// //     console.log("frontend se aa rha[image] ->", req.body)
// //     const base64Image = await convertToBase64(imageUrl);
// //     if (!base64Image) return { title: "Unknown", category: "Other", description: "Failed to process image" };

// //     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

// //     const prompt = `Analyze this emergency situation image and respond in this exact format without any asterisks or bullet points:
// //     TITLE: Write a clear, brief title  
// //     CATEGORY: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)  
// //     DESCRIPTION: Write a clear, concise description`;

// //     const result = await model.generateContent([prompt, { inlineData: { data: base64Image.split(",")[1], mimeType: "image/jpeg" } }]);

// //     const text = await result.response.text();
// //     return extractAnalysis(text);
// // };

// const analyzeImage = async (req, res) => {
//     try {
   
//       const { image } = req.body; // Base64 string from frontend
//   // console.log("req coming from client")
//       if (!image) {
//         return res.status(400).json({ error: "No image data received!" });
//       }
  
//       // ✅ Convert Base64 to required format
//       const base64Image = image.split(",")[1]; // Remove data:image/jpeg;base64, part
  
//       const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
//       const prompt = `Analyze this emergency situation image and respond in this exact format without any asterisks or bullet points:
//       TITLE: Write a clear, brief title  
//       CATEGORY: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)  
//       DESCRIPTION: Write a clear, concise description`;
  
//       const result = await model.generateContent([
//         prompt,
//         { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
//       ]);
//       console.log("img analysys res")
//       const text = await result.response.text();
//       const extractedData = extractAnalysis(text);

//   // console.log("extracted data img", extractedData)

//      return res.json(extractedData); // ✅ Send extracted data as JSON
//     } catch (error) {
//       console.log("Error analyzing image:", error);
//      return res.status(500).json({ error: "Internal Server Error" });
//     }
//   };
  
// module.exports ={analyzeImage}


// // **
 


// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const extractAnalysis = (text) => {
//   const titleMatch = text.match(/TITLE:\s*(.+)/);
//   const typeMatch = text.match(/CATEGORY:\s*(.+)/);
//   const descMatch = text.match(/DESCRIPTION:\s*(.+)/);

//   return {
//     title: titleMatch ? titleMatch[1].trim() : "Unknown",
//     category: typeMatch ? typeMatch[1].trim() : "Other",
//     description: descMatch ? descMatch[1].trim() : "No description available",
//   };
// };

// const analyzeImage = async (req, res) => {
//   try {
//     const { image } = req.body;

//     if (!image) {
//       return res.status(400).json({ error: "No image received" });
//     }

//     // ✅ Detect MIME + Base64 safely
//     const mimeMatch = image.match(/^data:(.*);base64,/);

//     if (!mimeMatch) {
//       return res.status(400).json({ error: "Invalid image format" });
//     }

//     const mimeType = mimeMatch[1];
//     const base64Image = image.replace(/^data:(.*);base64,/, "");

//     // ✅ Latest Fast Model
//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.0-flash",
//     });

//     const prompt = `
// Analyze this emergency situation image and respond in this exact format:

// TITLE: Write a clear, brief title
// CATEGORY: Choose one (Murder, Felony, Cybercrime, Antisocial Behavior, Assault, Hate Crime, Rape, Corrupt Behaviour, Money Laundering, Sexual Assault, Arson, Robbery, Domestic Violence, Fraud, Domestic Crime, Burglary, Human Trafficking, Kidnapping, Knife Crime, Theft, Fire Outbreak, Medical Emergency, Natural Disaster, Violence, Other)
// DESCRIPTION: Write a clear, concise description
// `;

//     const result = await model.generateContent([
//       prompt,
//       {
//         inlineData: {
//           data: base64Image,
//           mimeType,
//         },
//       },
//     ]);

//     const text = await result.response.text();
//     const extractedData = extractAnalysis(text);

//     return res.json(extractedData);
//   } catch (error) {
//     console.error("Gemini Error:", error);
//     return res.status(500).json({
//       error: "Image analysis failed",
//       message: error.message,
//     });
//   }
// };

// module.exports = { analyzeImage };



const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ Reuse model (Performance)
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash"
});

// ✅ Extract AI Response
const extractAnalysis = (text = "") => {
  return {
    title: text.match(/TITLE:\s*(.+)/)?.[1]?.trim() || "",
    category: text.match(/CATEGORY:\s*(.+)/)?.[1]?.trim() || "",
    description: text.match(/DESCRIPTION:\s*(.+)/)?.[1]?.trim() || ""
  };
};

const analyzeImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(200).json({
        aiFailed: true,
        title: "",
        category: "",
        description: ""
      });
    }

    // ✅ Validate Base64
    const match = image.match(/^data:(.*);base64,(.*)$/);

    if (!match) {
      return res.status(200).json({
        aiFailed: true,
        title: "",
        category: "",
        description: ""
      });
    }

    const mimeType = match[1];
    const base64Data = match[2];

    const prompt = `
Analyze this emergency situation image and respond EXACTLY in this format:

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
      console.log("AI Failed:", aiError.message);

      return res.status(200).json({
        aiFailed: true,
        title: "",
        category: "",
        description: ""
      });
    }

    const text = await result.response.text();
    const extracted = extractAnalysis(text);

    return res.json({
      aiFailed: false,
      ...extracted
    });

  } catch (error) {
    console.log("Server Error:", error.message);

    return res.status(200).json({
      aiFailed: true,
      title: "",
      category: "",
      description: ""
    });
  }
};

module.exports = { analyzeImage };