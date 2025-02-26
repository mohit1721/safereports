const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const PoliceStationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["POLICESTATION"], default: "POLICESTATION" }, // ✅ Default Set
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    isCentral: { type: Boolean, default: false } // ✅ Identify Central Police Station
});

// ✅ Password Hashing & Central Station Validation (Combined Middleware)
PoliceStationSchema.pre("save", async function (next) {
    try {
        // // ✅ Password Hashing
        // if (this.isModified("password")) {
        //     this.password = await bcrypt.hash(this.password, 10);
        // }

        // ✅ Ensure Only One Central Police Station
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
