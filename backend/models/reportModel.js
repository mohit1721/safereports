const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    reportId: { type: String, unique: true, required: true, index: true }, // ✅ Index Added
    type: { type: String, enum: ["EMERGENCY", "NON_EMERGENCY"], default: "EMERGENCY" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    assignedStation: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "PoliceStation",
      index: true      // ✅ Index for Faster Querying
    },
    files: [
      {
        url: { type: String, required: true }, // ✅ File URL
        fileType: { 
          type: String, 
          enum: ["IMAGE", "VIDEO", "PDF"], 
          required: true 
        } // ✅ Track file type
      }
    ],
    status: { 
      type: String, 
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "DISMISSED"], 
      default: "PENDING",
      index: true  // ✅ Index for Faster Filtering
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
