import { useState, useRef } from "react";
import {toast} from "react-hot-toast"
import axios from "axios";
import { Link } from "react-router-dom";

const AddPoliceStation = () => {
  const BASE_URL = "http://localhost:5000/api"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: { type: "Point", coordinates: [] },
    district: "",
    state: "",
    isCentral: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const locationInputRef = useRef(null);

  // Function to fetch user's current location
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            location: { type: "Point", coordinates: [longitude, latitude] },
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token"); // ✅ Get token
  
    if (!token) {
      console.error("No token found! User not authenticated.");
      toast.error("Authentication failed! Please login again.");
      setIsSubmitting(false);
      return;
    }
  
    // ✅ Ensure required fields are filled
    if (!formData.name || !formData.email || !formData.location.coordinates.length || !formData.district || !formData.state) {
      toast.error("All fields are required!");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await axios.post(
        `${BASE_URL}/admin/add-police-station`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Include token
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("PS created response:", response.data);
        if(response.data.success) {
      toast.success("Police Station Added Successfully");
  
      // ✅ Reset Form Data
      setFormData({
        name: "",
        email: "",
        location: { type: "Point", coordinates: [] },
        district: "",
        state: "",
        isCentral: false,
      });}
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.error || "Failed to add police station");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

<div className="mt-16 p-11">
{/* bg gradiendt */}
<div className="fixed inset-0 -z-10 min-h-screen">
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_50%)]" />
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.04),transparent_70%)]" />
      </div>
      <div className="flex flex-row gap-8 justify-between">
      <Link to="/admin-dashboard">
  <button className="bg-blue-500 p-2 cursor-pointer rounded-lg mx-auto">
    Go to Dashboard
  </button>
</Link>      
<p className="text-center user-select-none">Add Police Station</p>
      </div>
     
      <div className="mt-8 mb-8 bg-zinc-900/50 rounded-2xl border border-white/5 p-6 mx-auto max-w-3xl relative px-6 pt-8 rounded-2xl bg-zinc-900 p-5">

   
   
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Police Station Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5 text-white"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5 text-white"
          required
        />
      </div>

      {/* Password */}
      {/* <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5 text-white"
        />
      </div> */}

      {/* District */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          District
        </label>
        <input
          type="text"
          value={formData.district}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, district: e.target.value }))
          }
          className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5 text-white"
          required
        />
      </div>

      {/* State */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          State
        </label>
        <input
          type="text"
          value={formData.state}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, state: e.target.value }))
          }
          className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5 text-white"
          required
        />
      </div>
{/* Gobindpur Police Station , mohitkumarmandal192@gmail.com ,  */}
      {/* Location 23.7957, 86.4304 */}
      <div className="mt-4">
  <label className="block text-sm font-medium text-zinc-400 mb-2">
    Location (Longitude, Latitude)
  </label>
  <input
    type="text"
    value={formData.location.coordinates.join(", ")}
    onChange={(e) => {
      const [lng, lat] = e.target.value.split(",").map(Number); // स्ट्रिंग को नंबर में कन्वर्ट करें
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, coordinates: [lng, lat] }
      }));
    }}
    ref={locationInputRef}
    className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5 text-white"
  />
  <button
    type="button"
    onClick={handleUseCurrentLocation}
    className="cursor-pointer mt-2 text-sm text-sky-500 hover:underline"
  >
    Use Current Location
  </button>
</div>


      {/* Central Station Checkbox */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={formData.isCentral}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isCentral: e.target.checked }))
          }
          className="w-5 h-5 accent-sky-500"
        />
        <label className="text-sm text-zinc-400">Central Police Station</label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer w-full relative group overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 px-4 py-3.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="relative flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Add Police Station</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </div>
      </button>
    </form>
    </div>
</div>

  
    
  );
};

export default AddPoliceStation;
