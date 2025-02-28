const cloudinary = require("cloudinary").v2;

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload Single File to Cloudinary
exports.uploadToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder, resource_type: "auto" };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    const uploadedFile = await cloudinary.uploader.upload(file.tempFilePath, options);
    return uploadedFile.secure_url; // ✅ Returns Uploaded Image URL
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("File upload failed!");
  }
};
