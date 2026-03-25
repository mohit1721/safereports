const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const PoliceStation = require("../models/policeStationModel");

dotenv.config();

const seedData = [
  ["Delhi Central Police Station", "delhi.central@safereports.in", "New Delhi", "Delhi", 28.6139, 77.209],
  ["Mumbai South Police Station", "mumbai.south@safereports.in", "Mumbai", "Maharashtra", 18.9388, 72.8354],
  ["Bengaluru City Police Station", "bengaluru.city@safereports.in", "Bengaluru Urban", "Karnataka", 12.9716, 77.5946],
  ["Kolkata North Police Station", "kolkata.north@safereports.in", "Kolkata", "West Bengal", 22.5726, 88.3639],
  ["Chennai Central Police Station", "chennai.central@safereports.in", "Chennai", "Tamil Nadu", 13.0827, 80.2707],
  ["Hyderabad Central Police Station", "hyderabad.central@safereports.in", "Hyderabad", "Telangana", 17.385, 78.4867],
  ["Pune City Police Station", "pune.city@safereports.in", "Pune", "Maharashtra", 18.5204, 73.8567],
  ["Ahmedabad City Police Station", "ahmedabad.city@safereports.in", "Ahmedabad", "Gujarat", 23.0225, 72.5714],
  ["Jaipur City Police Station", "jaipur.city@safereports.in", "Jaipur", "Rajasthan", 26.9124, 75.7873],
  ["Lucknow City Police Station", "lucknow.city@safereports.in", "Lucknow", "Uttar Pradesh", 26.8467, 80.9462],
  ["Patna City Police Station", "patna.city@safereports.in", "Patna", "Bihar", 25.5941, 85.1376],
  ["Bhopal City Police Station", "bhopal.city@safereports.in", "Bhopal", "Madhya Pradesh", 23.2599, 77.4126],
  ["Chandigarh Central Police Station", "chandigarh.central@safereports.in", "Chandigarh", "Chandigarh", 30.7333, 76.7794],
  ["Kochi City Police Station", "kochi.city@safereports.in", "Ernakulam", "Kerala", 9.9312, 76.2673],
  ["Bhubaneswar Police Station", "bhubaneswar@safereports.in", "Khordha", "Odisha", 20.2961, 85.8245],
  ["Guwahati Police Station", "guwahati@safereports.in", "Kamrup Metro", "Assam", 26.1445, 91.7362],
  ["Ranchi Police Station", "ranchi@safereports.in", "Ranchi", "Jharkhand", 23.3441, 85.3096],
  ["Srinagar Police Station", "srinagar@safereports.in", "Srinagar", "Jammu and Kashmir", 34.0837, 74.7973],
  ["Raipur Police Station", "raipur@safereports.in", "Raipur", "Chhattisgarh", 21.2514, 81.6296],
  ["Thiruvananthapuram Police Station", "trivandrum@safereports.in", "Thiruvananthapuram", "Kerala", 8.5241, 76.9366],
];

async function seedPoliceStations() {
  await connectDB();

  const defaultPassword = await bcrypt.hash(process.env.DEFAULT_STATION_PASSWORD || "Safe@1234", 10);

  const docs = seedData.map(([name, email, district, state, lat, lon], index) => ({
    name,
    email,
    password: defaultPassword,
    role: "POLICESTATION",
    district,
    state,
    isCentral: index === 0,
    location: { type: "Point", coordinates: [lon, lat] },
  }));

  await PoliceStation.bulkWrite(
    docs.map((doc) => ({
      updateOne: {
        filter: { email: doc.email },
        update: { $set: doc },
        upsert: true,
      },
    }))
  );

  console.log(`✅ Upserted ${docs.length} police stations across Indian cities.`);
  process.exit(0);
}

seedPoliceStations().catch((error) => {
  console.error("❌ Seeder failed", error);
  process.exit(1);
});
