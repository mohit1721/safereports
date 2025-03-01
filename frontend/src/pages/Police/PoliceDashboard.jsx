import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import  {toast} from "react-hot-toast"
import axios from "axios"
const BASE_URL = "http://localhost:5000/api";

// import 'video-react/dist/video-react.css'; //~ in new
// import {
//   BigPlayButton,
//   ControlBar,
//   CurrentTimeDisplay,
//   ForwardControl,
//   PlayToggle,
//   PlaybackRateMenuButton,
//   Player,
//   ReplayControl,
//   TimeDivider,
//   VolumeMenuButton
// } from "video-react";
const PoliceDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [policeStation, setPoliceStation] = useState(null);

  useEffect(() => {
    // 📌 Get the logged-in police station details from localStorage
    const storedUser = localStorage.getItem("user");
    console.log("user in police", storedUser);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log("username in police", user.name);

      setPoliceStation(user || "Unknown Station");
    }
  }, []);
  // 📌 Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("User logged out")
    navigate("/login");
  };

  // 📌 Fetch Reports (Police-Specific)
  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const validFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        );
        const queryParams = new URLSearchParams(validFilters).toString();
        const token = localStorage.getItem("token"); // 🔥 Get token from localStorage
        console.log("going Response for logged in station")

        // const response = await fetch(`${BASE_URL}/report/reports/police-station?${queryParams}`);
        const data = await axios.get(`${BASE_URL}/police/reports/police-station?${queryParams}`, {
          headers: {
            "Authorization": `Bearer ${token}`, // 🔥 Include token
            "Content-Type": "application/json",
          }
        });
        console.log("Response for logged in station",data)
          // ✅ Check if response is actually JSON
    const contentType = data.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response format. Received HTML instead of JSON.");
    }
        // const data = await response.json();
        console.log("Response for logged in station",data)
        toast.success(data.data.message);
        setReports(data.data.reports || []);
      } catch (error) {
        toast.error(error.message)
        console.log("Error fetching reports:", error);
      }
      setIsLoading(false);
    };

    fetchReports();
  }, [filters]);

  // 📌 Status Color Function
  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
      IN_PROGRESS: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
      RESOLVED: "bg-green-500/10 text-green-500 border border-green-500/20",
      DISMISSED: "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20",
    };
    return colors[status] || "bg-gray-500";
  };

  // 📌 Update Report Status
  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem("token"); // 🔥 Get token from localStorage
  
      if (!token) {
        console.error("No token found! User not authenticated.");
        return;
      }
  
      const response = await fetch(`${BASE_URL}/police/status/${reportId}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`, // ✅ Include token
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      const data = await response.json(); // ✅ Parse response JSON safely
  
      if (!data.success) {
        console.error("Failed to update status:", data.message || "Unknown error");
        return;
      }
  
      // ✅ Update state if successful
      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId ? { ...report, status: newStatus } : report
        )
      );
  
      console.log("Report status updated successfully!");
  
    } catch (error) {
      toast.error(error.message)
      console.log("Error updating status:", error.message);
    }
  };
  

  // 📌 Show Loading Spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="border-b mt-16 border-neutral-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex flex-col md:flex-row items-center gap-4">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
        Police Dashboard
      </h1>
      <span className="text-neutral-400 text-sm bg-neutral-900 px-3 py-1 rounded-md border border-neutral-700">
        📍 {policeStation.name + "," + policeStation.state || "Unknown Station"}
      </span>
    </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-900 rounded-lg hover:bg-neutral-800 border border-neutral-800 transition-all hover:border-neutral-700"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Filters */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 w-full flex flex-col md:flex-row">
          <input
          type="text"
          placeholder="Search by Title"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border w-full text-sm w-full p-2 rounded w-1/3"
        />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="bg-neutral-900 w-full border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="bg-neutral-900 w-full border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2"
            >
              <option value="">All Types</option>
              <option value="THEFT">Theft</option>
              <option value="ASSAULT">Assault</option>
              <option value="VANDALISM">Vandalism</option>
            </select>
          </div>

          <div className="text-neutral-400">{reports.length} Reports</div>
        </div>

        {/* Reports List */}
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800 hover:border-neutral-700 transition-all"
            >
              <div className="flex justify-between items-start gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-medium text-neutral-200">{report.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>

                  <p className="text-neutral-400 text-sm">{report.description}</p>
                  <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
                    <span>📍 {report.address || "N/A"}</span>
                    <span>📅 {new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>

                  {report.image && (
                    <img
                      src={report.image}
                      alt="Report"
                      className="mt-4 w-[20rem] h-[20rem] object-cover rounded-lg border border-neutral-800"
                    />
                  )}
                  {report?.video ? (
  <video
  src={`${report?.video}`}
    controls
    className="mt-4 object-cover rounded-lg w-[200px] lg:w-[20rem] h-auto lg:h-[20rem] border border-neutral-800"
  />
) : (
  <p className="text-neutral-500">Video not available</p>
)} 
                  {report.files?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium text-neutral-200">Download Evidence</h3>
                      <div className="space-y-2">
                        {report.files.map((file) => (
                          <a
                            key={file.id}
                            href={file.filePath}
                            download
                            className="text-blue-500 hover:underline"
                          >
                            {file.fileType.toUpperCase()} File
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Update */}
                <select
                  value={report.status}
                  onChange={(e) => updateReportStatus(report._id, e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg px-4 py-2"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="DISMISSED">Dismissed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
        {reports.length === 0 && (
  <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900/50 rounded-xl border border-neutral-800 text-neutral-400 py-12">
    {console.log("No Reports Found! filteredReports.length =", reports.length)}
    
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-16 h-16 text-neutral-500 mb-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01M9.75 21h4.5a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25h-4.5A2.25 2.25 0 007.5 7.5v11.25A2.25 2.25 0 009.75 21z"
      />
    </svg>
    <h2 className="text-lg font-semibold text-neutral-300">
      No Reports Available for your station
    </h2>
    <p className="text-sm text-neutral-500 mt-2">
      No reports have been submitted yet. Please check back later.
    </p>
  </div>
)}
  
      </main>
    </div>
  );
};

export default PoliceDashboard;
