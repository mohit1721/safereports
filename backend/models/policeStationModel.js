 
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const PoliceStationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String},
    role: { type: String, enum: ["POLICESTATION"], default: "POLICESTATION" }, 
    location: {
        type: { type: String, enum: ["Point"], required: true, default: "Point" }, // ✅ GeoJSON format
        coordinates: { type: [Number], required: true, index: "2dsphere" }, // ✅ Store as [longitude, latitude]
    },
    district: { type: String, required: true },
    state: { type: String, required: true },
    isCentral: { type: Boolean, default: false },
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }] // ✅ Reports reference added

});

// ✅ Create Geospatial Index 
PoliceStationSchema.index({ location: "2dsphere" });

// ✅ Ensure Only One Central Police Station
PoliceStationSchema.pre("save", async function (next) {
    try {
        if (this.isCentral) {
            const existingCentralStation = await mongoose.model("PoliceStation").findOne({ isCentral: true });
            if (existingCentralStation && existingCentralStation._id.toString() !== this._id.toString()) {
                throw new Error("Only one Central Police Station can exist.");
            }
        }

        next();
    } catch (error) {
        next(error);
    }
});



// ✅ Password Match Method
PoliceStationSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("PoliceStation", PoliceStationSchema);
