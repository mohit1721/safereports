import React, { useState, useRef, useCallback, useEffect } from 'react';
// import crypto from 'crypto';
import {useDropzone } from 'react-dropzone'
 import ImageUpload from "../../components/report/ImageUpload"
import VideoUpload from '../../components/report/VideoUpload';
import {toast} from "react-hot-toast"
import axios from "axios"
// import crypto from "crypto";

// const BASE_URL = process.env.REACT_APP_BASE_URL
const BASE_URL = "http://localhost:5000/api"
const REPORTCATEGORY = [
  "Murder", "Felony", "Cybercrime", "Antisocial Behavior", "Assault", "Hate Crime",
  "Money Laundering", "Sexual Assault", "Arson", "Robbery", "Domestic Violence",
  "Fraud", "Domestic Crime", "Burglary", "Corrupt Behavior", "Human Trafficking",
  "Kidnapping", "Knife Crime", "Theft", "Fire Outbreak", "Medical Emergency",
  "Natural Disaster", "Violence", "Other"
];

function ReportForm({ onComplete }) {
  
  const [formData, setFormData] = useState({
    reportId: "", // ✅ Generate unique report ID on initialization
    incidentType: "EMERGENCY",
    title: "",
    category: "",
    address: "",
    // location: {
    //     type: "Point",
    //     coordinates: [], // [longitude, latitude] format
    // },
    description: "",
    assignedStation: null, // Police station ka ObjectId
    image: null,
    video: null

  });
  const [imageFile, setImageFile] = useState(null); // ✅ Actual Image File for Report Submission
  const [videoFile, setVideoFile] = useState(null); // ✅ Actual Video File for Report Submission

  const [image, setImage] = useState(null);// ✅ Base64 Image for AI Analysis
  const [isAnalyzingi, setIsAnalyzingi] = useState(false);
  const [isAnalyzingv, setIsAnalyzingv] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [video, setVideo] = useState(null);
  const [stationOptions, setStationOptions] = useState([]); // ✅ Stores nearby stations list
  const [fileType, setFileType] = useState("image"); // Default "image"
  const videoInputRef = useRef(null); // ✅ Create a ref for input
  const imageInputRef = useRef(null); // ✅ Create a ref for input
  const [loadingLocation, setLoadingLocation] = useState(false); // Track location fetch status

  // GOOD TEST
const handleImageUpload = async (e) => {
    // const file = imageInputRef.current?.files?.[0]; // ✅ Access file from ref
    // console.log("video file from ref=>", file)
    const file = e.target.files?.[0]
    console.log("files  on image ->", e.target.files);

    if (!file) return;
  
    setIsAnalyzingi(true);
  
    try {
      //  const formData = new FormData()
      // formData.append("image", file); // Backend expects "image" field

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
  
      setImage(base64); // ✅ Store Base64 im
      setImageFile(file); // ✅ Store Image File (Report Create ke liye)

       // ✅ Backend ko bhejo
      //  console.log("Base64 Image Sending to Backend:", base64); // Debugging

       // ✅ Send Base64 as JSON (Not multipart/form-data)
       const response = await axios.post(
         `${BASE_URL}/analyze/image`,
         { image: base64 }, // Sending Base64 string inside JSON
         {
           headers: {
             "Content-Type": "application/json", // ✅ Correct Content-Type for JSON
           },
         }
       );
   
      //  console.log("Response from Backend:", response.data);
   
   
      // const data = await response.json();
  
      if (response.data.title && response.data.description && response.data.category) {
        setFormData((prev) => ({
          ...prev,
          title: response.data.title,
          description: response.data.description,
          category: response.data.category,
        }));
        setImage(URL.createObjectURL(file)); // For previewing the uploaded image
      }
    } catch (error) {
      toast.error("Error analyzing image");
      console.error("Error analyzing image:", error);
    } finally {
      setIsAnalyzingi(false);
    }
  };
  // GOOD TEST
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setIsAnalyzingv(true);
  
    try {
      // ✅ Convert video to Base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
  
      setVideo(base64); // ✅ Store Base64 for frontend preview
  
      // console.log("Base64 Video Sending to Backend:", base64); // Debugging
  
      // ✅ Send Base64 to backend
      const response = await axios.post(
        `${BASE_URL}/analyze/video`,
        { video: base64 }, // Sending Base64 inside JSON
        {
          headers: {
            "Content-Type": "application/json", // ✅ Correct Content-Type for JSON
          },
        }
      );
  
      // console.log("Response from Backend:", response.data);
  
      if (response.data.title && response.data.description && response.data.category) {
        setFormData((prev) => ({
          ...prev,
          title: response.data.title,
          description: response.data.description,
          category: response.data.category,
        }));
        setVideo(URL.createObjectURL(file)); // ✅ For video preview
      }
    } catch (error) {
      toast.error("Error analyzing video");
      console.error("Error analyzing video:", error);
    } finally {
      setIsAnalyzingv(false);
    }
  };
  useEffect(() => {
    if (coordinates.latitude && coordinates.longitude) {
      setFormData((prev) => ({
        ...prev,
        location: { 
          type: "Point", 
          coordinates: [coordinates.longitude, coordinates.latitude] 
        }
      }));
    }
  }, [coordinates]);
  const generateReportId = useCallback(() => {
    const timestamp = Date.now().toString();
  
    // Generate 16 random bytes in hexadecimal (browser-compatible)
    const randomBytes = Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  
    // Combine timestamp and randomBytes
    const combinedString = `${timestamp}-${randomBytes}`;
  
    // Generate SHA-256 hash and slice first 16 chars
    return window.btoa(combinedString).replace(/[^a-zA-Z0-9]/g, "").slice(0, 16);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("files  on Submit ->", e.target.files);
    const formDataToSend = new FormData(); // ✅ Creating FormData for file upload
    formData.reportId = generateReportId();
    formDataToSend.append("reportId", formData.reportId); // ✅ Attach unique report ID

    // ✅ Append form data (Non-file fields)
    formDataToSend.append('type', formData.incidentType);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('category', formData.category || "Other");
    formDataToSend.append('address', formData.address || "Unknown Location");
    formDataToSend.append('description', formData.description || "No Description");
    // formDataToSend.append('assignedStation', formData.assignedStation);
    formDataToSend.append("assignedStation", formData.assignedStation?._id || formData.assignedStation);

    // ✅ Append location coordinates properly
    // const coordinates = formData.location?.coordinates || {};
    // formDataToSend.append('location', JSON.stringify({
    //   type: 'Point',
    //   coordinates: [coordinates.longitude || 0, coordinates.latitude || 0]
    // }));
    // const coordinates = formData.location?.coordinates?.length === 2 
    // ? formData.location.coordinates 
    // : [0, 0]; // Default [longitude, latitude]
  
  // formDataToSend.append('location', JSON.stringify({
  //     type: 'Point',
  //     coordinates
  // }));
  
    
      // ✅ Image File ko bhi send karein (Cloudinary ke liye)
      if (imageFile) {
        formDataToSend.append('image', imageFile);
    }
     // ✅ Image File ko bhi send karein (Cloudinary ke liye)
     if (videoFile) {
      formDataToSend.append('video', videoFile);
  }
    // const file = e.target.files?.[0]
// console.log("files submitting i", imageInputRef.current.files[0]);
    // if (!file) return;
    // ✅ Append image & video only if available
    // if (imageInputRef.current?.files?.[0]) {
    //   formDataToSend.append('image', imageInputRef.current.files[0]);
    // }
    // if (videoInputRef.current?.files?.[0]) {
    //   formDataToSend.append('video', videoInputRef.current.files[0]);
    // }
  
    setIsSubmitting(true);
    console.log("Address before sending:", formData.address);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/report/create",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } } // ✅ Correct headers for file upload
      );
  
      console.log("create Response from backend:", response.data);
  
      if (response.data) {
        onComplete(response.data.report);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error(error.response?.data?.message || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formDataToSend = new FormData();  // Creating a new FormData object to append files correctly

  // // Append form data (Non-file fields)
  // formDataToSend.append('type', formData.incidentType);
  // formDataToSend.append('title', formData.title);
  // formDataToSend.append('category', formData.category|| "Other");
  // formDataToSend.append('address', formData.address || "Unknown Location");
  //  formDataToSend.append('description', formData.description || "No Description");
  // formDataToSend.append('assignedStation', formData.assignedStation);
  // const coordinates = formData.location.coordinates;
  // formDataToSend.append('location', JSON.stringify({ type: 'Point', coordinates: [coordinates.longitude || 0, coordinates.latitude || 0] }));

  // // Append image and video if they exist
  // if (image) {
  //   formDataToSend.append('image', imageInputRef.current?.files[0]);
  // }
  // if (video) {
  //   formDataToSend.append('video', videoInputRef.current?.files[0]);
  // }
  //   setIsSubmitting(true);
  //   try {
   

  //     const response = await axios.post("http://localhost:5000/api/report/create",formDataToSend
    
    
  //   );   

  //     const result = await response.json();

  //     if (!response.ok) {
  //       throw new Error(result.message || "Failed to submit report");
  //     }
  //     onComplete(result);
  //     toast.success(result.message);
  //   } catch (error) {
  //     console.log("Error submitting report:", error);
  //     toast.error(error.message);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "location") {
        // Latitude & Longitude ko comma separated form me leke [lng, lat] array me convert karna
        const [latitude, longitude] = value.split(",").map(coord => parseFloat(coord.trim()));
        setFormData(prev => ({
            ...prev,
            location: { type: "Point", coordinates: [longitude, latitude] }
        }));
    } else {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
};
const fetchCurrentLocation = () => {
  if (!navigator.geolocation) {
    toast.err("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // Reverse geocode to get an address from latitude & longitude
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`
        );
        const data = await response.json();

        if (data.results?.length > 0) {
          const formattedAddress = data.results[0].formatted;
          handleLocationChange(formattedAddress, [longitude, latitude]);
        } else {
          handleLocationChange("", [longitude, latitude]); // If address is not found, store only coordinates
        }
      } catch (error) {
        toast.error("Reverse geocoding error:", error);

        console.error("Reverse geocoding error:", error);
        handleLocationChange("", [longitude, latitude]); // Handle error by storing only coordinates
      }
    },
    (error) => {
      console.error("Geolocation error:", error);
      toast.error("Geolocation error:", error);

      toast.error("Geolocation is not available or permission denied.");
    }
  );
};
const handleLocationChange = (address, coordinates = []) => {
  setFormData((prev) => ({
    ...prev,
    address: address || prev.address, // Address will update if available
    location: {
      type: "Point",
      coordinates: coordinates.length ? coordinates : prev.location.coordinates, // Store [longitude, latitude]
    },
  }));
};
//GOOD- for near-by police stations
// const handleUseCurrentLocation = () => {
//   if (!navigator.geolocation) {
//     toast.error("Geolocation is not supported by this browser.");
//     return;
//   }

//   navigator.geolocation.getCurrentPosition(
//     async (position) => {
//       const { latitude, longitude } = position.coords;

//       // ✅ Update location in formData
//       setFormData((prev) => ({
//         ...prev,
//         location: { type: "Point", coordinates: [longitude, latitude] },
//       }));

//       try {
//         // ✅ Fetch nearest police stations
//         const response = await fetch(
//             `${BASE_URL}/police/nearest?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`

//           // `${BASE_URL}/police/nearest?latitude=${latitude}&longitude=${longitude}`
//         );
//         const data = await response.json();
// console.log(data);
//         if (!data?.nearestStation && (!data?.options || data.options.length === 0)) {
//           toast.error(data.message);
//           return;
//         }

//         // ✅ If only one station is available, directly assign it
//         if (data?.nearestStation) {
//           console.log("✅ Nearest Station:", data.nearestStation); // Debugging nearest station

//           setFormData((prev) => ({
//             ...prev,
//             assignedStation: {
//               name: data.nearestStation.name || "Unknown",
//         district: data.nearestStation.district || "Unknown",
//         state: data.nearestStation.state || "Unknown",
//             },
//           }));
//         }

//         // ✅ If multiple stations, store options & auto-select the first one (if not set)
//         if (data?.options?.length > 1) {
//           console.log("📌 Available Police Stations:", data.options); // Debugging multiple options

//           setStationOptions(data.options);
//           setFormData((prev) => ({
//             ...prev,
//             assignedStation: prev.assignedStation || data.options[0],
//           }));
//         }
//       } catch (error) {
//         console.error("Error fetching nearest police stations:", error);
//         toast.error(`Error: ${error.message || "mk Failed to fetch stations"}`);
//       }
//     },
//     (error) => {
//       console.error("Geolocation error:", error);
//       toast.error("Geolocation permission denied or unavailable.");
//     }
//   );
// };
const handleUseCurrentLocation = () => {
  if (!navigator.geolocation) {
    toast.error("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      setFormData((prev) => ({
        ...prev,
        location: { type: "Point", coordinates: [longitude, latitude] },
      }));

      try {
        const response = await fetch(
          `${BASE_URL}/police/nearest?latitude=${latitude}&longitude=${longitude}`
        );
        const data = await response.json();

        if (!data?.nearestStation && (!data?.options || data.options.length === 0)) {
          toast.error("No nearby police station found.");
          return;
        }

        if (data?.nearestStation) {
          setFormData((prev) => ({
            ...prev,
            assignedStation: {
              _id: data.nearestStation._id,
              name: data.nearestStation.name || "Unknown",
              district: data.nearestStation.district || "Unknown",
              state: data.nearestStation.state || "Unknown",
            },
          }));
        }

        if (data?.options?.length > 1) {
          setStationOptions(data.options);
          setFormData((prev) => ({
            ...prev,
            assignedStation: prev.assignedStation || data.options[0],
          }));
        }
      } catch (error) {
        console.error("Error fetching police stations:", error);
        toast.error("Failed to fetch police stations.");
      }
    },
    (error) => {
      console.error("Geolocation error:", error);
      toast.error("Geolocation permission denied or unavailable.");
    }
  );
};

useEffect(() => {
  if (formData.assignedStation && typeof formData.assignedStation === "string") {
    const fetchPoliceStationDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/police/${formData.assignedStation}`);
        const data = await response.json();

        if (data.success) {
          setFormData((prev) => ({ ...prev, assignedStation: data.policeStation }));
        }
      } catch (error) {
        console.error("Error fetching assigned police station:", error);
      }
    };

    fetchPoliceStationDetails();
  }
}, [formData.assignedStation]);


  const handleCoordinatesChange = (lat, lng) => {
    setCoordinates({ latitude: lat, longitude: lng });
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
    {/* type */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, incidentType: "EMERGENCY" }))}
          className={`p-6 rounded-2xl border-2 transition-all duration-200 ${formData.incidentType === "EMERGENCY" ? "bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20" : "bg-zinc-900/50 border-zinc-800 hover:bg-red-500/10 hover:border-red-500/50"}`}
        >
          <div className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-medium text-red-500">Emergency</span>
            <span className="text-xs text-zinc-400">Immediate Response Required</span>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setFormData((prev) => ({ ...prev, incidentType: "NON_EMERGENCY" }))}
          className={`p-6 rounded-2xl border-2 transition-all duration-200 ${formData.incidentType === "NON_EMERGENCY" ? "bg-orange-500/20 border-orange-500 shadow-lg shadow-orange-500/20" : 
          "bg-zinc-900/50 border-zinc-800 hover:bg-orange-500/10 hover:border-orange-500/50"}`}>
          {/* </button> */}
          <div className="flex flex-col items-center space-y-2">
            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-orange-500">Non-Emergency</span>
            <span className="text-xs text-zinc-400">General Report</span>
          </div>
        </button>
      </div>
{/*  image*/}
<ImageUpload
 onClick={()=> setFileType("image")}
  image={image} 
  setImage={setImage} 
  handleImageUpload={handleImageUpload} 
  isAnalyzingi={isAnalyzingi} 
  ref={imageInputRef} // ✅ Pass ref as a prop

/>
<VideoUpload 
onClick={()=> setFileType("video")}
  video={video} 
  setVideo={setVideo} 
  handleVideoUpload={handleVideoUpload} 
  isAnalyzingv={isAnalyzingv} 
  videoInputRef={videoInputRef} // ✅ Pass ref as a prop

/>

{/* video */}
 
{/* Category */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Incident Cagory
        </label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, category: e.target.value }))
          }
className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5
                   text-white transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          required
        >
          <option value="">Select type</option>
          {REPORTCATEGORY.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
{/* address */}
<div className="mt-4">
  {/* Label for location input */}
  <label className="block text-sm font-medium text-zinc-400 mb-2">Incident Address</label>

  {/* Address input field */}
  <input
    type="text"
    // value={formData.address || formData.location.coordinates.length > 0 ? formData.location.coordinates.join(", ") : ""}
    value={formData.address}
    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
    className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5
               text-white transition-colors duration-200
               focus:outline-none focus:ring-2 focus:ring-sky-500/40"
    placeholder="Enter address"
    required
  />

  {/* Button to get current location */}
  {/* <button
    type="button"
    onClick={fetchCurrentLocation}
    className="mt-2 text-sm text-sky-500 hover:underline"
  >
    Use Current Location
  </button> */}
</div>
{/* nearby police station */}
<div className="mt-4">
  <label className="block text-sm font-medium text-zinc-400 mb-2">
    Nearby Police Station
  </label>

  <div className="flex items-center space-x-4">
    {/* Location Input */}
    <input
      type="text"
      value={
        loadingLocation
          ? "Fetching police station..."
          : formData.assignedStation && typeof formData.assignedStation === "object"
          ? `${formData.assignedStation.name}, ${formData.assignedStation.district}, ${formData.assignedStation.state}`
          : ""
      }
      readOnly
      className="w-full rounded-2xl bg-zinc-900/50 border-2 border-zinc-800 px-4 py-3.5 text-white shadow-md shadow-zinc-800/20"
    />

    {/* Use Current Location Button */}
    <button
      type="button"
      onClick={handleUseCurrentLocation}
      className="p-3 rounded-2xl border-2 transition-all duration-200 text-sky-500 border-sky-500/50 bg-sky-500/10 hover:bg-sky-500/20 shadow-lg shadow-sky-500/10"
    >
      Use Location
    </button>
  </div>

  {/* Police Station Selection (Dropdown if more than 1) */}
  {stationOptions.length > 1 && (
    <div className="mt-4">
      <label className="block text-sm font-medium text-zinc-400 mb-2">
        Select Nearest Police Station
      </label>
      <div className="p-4 rounded-2xl border-2 bg-zinc-900/50 border-zinc-800 shadow-lg shadow-zinc-800/20">
        <select
          value={formData.assignedStation?._id || ""}
          onChange={(e) => {
            const selectedStation = stationOptions.find(
              (station) => station._id === e.target.value
            );
            setFormData((prev) => ({ ...prev, assignedStation: selectedStation }));
          }}
          className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5 text-white"
        >
          <option value="" disabled>Select a police station</option>
          {stationOptions.map((station) => (
            <option key={station._id} value={station._id}>
              {station.name} ({station.district}, {station.state})
            </option>
          ))}
        </select>
      </div>
    </div>
  )}
</div>
{/* title */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Report Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5
                   text-white transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          required
        />
      </div>
{/* description */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={4}
          className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 px-4 py-3.5
                   text-white transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          required
        />
      </div>
{/* submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 
                 px-4 py-3.5 text-sm font-medium text-white shadow-lg
                 transition-all duration-200 hover:from-sky-400 hover:to-blue-500
                 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <span>Submit Report</span>
              <svg
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          )}
        </div>
      </button>
    </form>
  );
}

export default ReportForm;
