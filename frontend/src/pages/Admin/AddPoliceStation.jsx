import { useState, useRef } from "react";
import {toast} from "react-hot-toast"
import axios from "axios";
import { Link } from "react-router-dom";
import { Copy, X } from "lucide-react";
import copy from "copy-to-clipboard";

const AddPoliceStation = () => {
  // https://safereports.onrender.com
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "https://safereports.onrender.com/api";
  //  || "http://localhost:5000/api" .....
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
  const [resetLink, setResetLink] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stationEmail, setStationEmail] = useState("");

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
  
        if(response.data.success) {
      const addedEmail = formData.email;
      toast.success(`Police Station Added! ${addedEmail} needs to check the mail & set their password.`, { duration: 6000 });

      // Email is sent in the background — always show the invite link so the
      // admin can copy/share it if the email fails to deliver.
      if (response.data.resetLink) {
        setResetLink(response.data.resetLink);
        setStationEmail(addedEmail);
        setShowResetModal(true);
      }
  
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

  const handleCopyResetLink = () => {
    copy(resetLink);
    setCopied(true);
    toast.success("Invite link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (

<div className="mt-16">
{/* bg gradiendt */}
<div className="fixed inset-0 -z-10 min-h-screen">
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_50%)]" />
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.04),transparent_70%)]" />
      </div>
      <div className="flex flex-row justify-evenly w-full mt-4">
      <Link to="/admin-dashboard">
  <button className="bg-blue-500 p-2 cursor-pointer rounded-lg mx-auto">
    Go to Dashboard
  </button>
      </Link>      
<p className="text-center user-selection-none">Add Police Station</p>
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


      {/* Central Station Checkbox -->*/}
      {/* <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={formData.isCentral}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isCentral: e.target.checked }))
          }
          className="w-5 h-5 accent-sky-500"
        />
        <label className="text-sm text-zinc-400">Central Police Station</label>
      </div> */}

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

    {/* Invite link modal (shown after adding; link is the manual fallback if the email fails) */}
    {showResetModal && resetLink && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setShowResetModal(false)}
        />
        <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 text-green-400 ring-1 ring-green-500/20">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <h3 className="text-lg font-medium text-white">Police Station Added</h3>
              </div>
              <p className="mt-2 text-sm text-neutral-400">
                An invite email was sent to <span className="text-neutral-200">{stationEmail}</span>.
                If it doesn't arrive, share this reset link so they can set their password.
              </p>
            </div>
            <button
              onClick={() => setShowResetModal(false)}
              className="cursor-pointer shrink-0 rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 p-3">
            <input
              readOnly
              value={resetLink}
              onFocus={(e) => e.target.select()}
              className="w-full bg-transparent text-sm text-sky-400 focus:outline-none"
            />
            <button
              onClick={handleCopyResetLink}
              className="cursor-pointer flex shrink-0 items-center gap-1.5 rounded-lg bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-400 ring-1 ring-sky-500/20 transition hover:bg-sky-500/20"
            >
              {copied ? "Copied!" : "Copy"}
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>

          <p className="mt-3 text-xs text-neutral-500">
            The link expires in 1 hour and can be used once.
          </p>

          <div className="mt-5 flex justify-end">
            <button
              onClick={() => setShowResetModal(false)}
              className="cursor-pointer rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 transition hover:bg-neutral-800"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )}
</div>

  
    
  );
};

export default AddPoliceStation;
