const { v2: cloudinary } = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config();

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload Files to Cloudinary (Handles Both Multer Files & Base64 Strings)
const uploadFiles = async (files) => {
  try {
    const uploadPromises = files.map((file) => {
      if (file.path) {
        // ✅ If file is from Multer (Form-Data)
        return cloudinary.uploader.upload(file.path, { resource_type: "auto" });
      } else if (file.base64) {
        // ✅ If file is Base64 String
        return cloudinary.uploader.upload(file.base64, { resource_type: "auto" });
      } else {
        throw new Error("Invalid file format! Must be Multer file or Base64 string.");
      }
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    return uploadedFiles.map((file) => file.secure_url);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("File upload failed!");
  }
};

// ✅ Export for CommonJS
module.exports = { uploadFiles };
