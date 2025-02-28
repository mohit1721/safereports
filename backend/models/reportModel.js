 
const mongoose = require("mongoose");
// const { v4: uuidv4 } = require("uuid");

// default: () => `REP-${uuidv4().replace(/-/g, "").slice(0, 8)}`
const reportSchema = new mongoose.Schema(
  {
    reportId: { type: String, unique: true, required: true, index: true },
    type: { type: String, enum: ["EMERGENCY", "NON_EMERGENCY"], default: "EMERGENCY" },
    title: { type: String, required: true },
    category: {  // ✅ New field added
      type: String, 
      enum: [
        "Murder", "Felony", "Cybercrime", "Antisocial Behavior", "Assault", "Hate Crime", 
        "Corrupt Behaviour", "Money Laundering", "Sexual Assault", "Arson", "Robbery", 
        "Domestic Violence", "Fraud", "Domestic Crime", "Burglary", "Human Trafficking", 
        "Kidnapping", "Knife Crime", "Theft", "Fire Outbreak", "Medical Emergency", 
        "Natural Disaster", "Violence", "Other"
      ], 
      
      required: true 
    },
    description: { type: String, required: true },
    address: { type: String, required: true},
    // location: {
    //   type: { type: String, enum: ["Point"], required: true, default: "Point" }, // ✅ GeoJSON format
    //   coordinates: { type: [Number], required: true, index: "2dsphere" }, // ✅ Store as [longitude, latitude]
    // },
    assignedStation: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "PoliceStation",
      index: true
    },
    image: { type: String }, 
    video: { type: String }, 
    status: { 
      type: String, 
      enum: ["PENDING", "IN_PROGRESS", "RESOLVED", "DISMISSED"], 
      default: "PENDING",
      index: true
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Ensure geospatial index
// reportSchema.index({ location: "2dsphere" });

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
 

 