import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast"
const BASE_URL = "http://localhost:5000/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: "",
    page: 1,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully")
    navigate("/login");
  };

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const validFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        );
        const queryParams = new URLSearchParams(validFilters).toString();

        const response = await fetch(`${BASE_URL}/admin/reports/admin?${queryParams}`);
        const data = await response.json();
        setReports(data.reports || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
      setIsLoading(false);
    };

    fetchReports();
  }, [filters]);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
      IN_PROGRESS: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
      RESOLVED: "bg-green-500/10 text-green-500 border border-green-500/20",
      DISMISSED: "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20",
    };
    return colors[status] || "bg-gray-500";
  };

  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/report/update/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setReports((prevReports) =>
          prevReports.map((report) =>
            report.id === reportId ? { ...report, status: newStatus } : report
          )
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

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
      <nav className="border-b top-16 border-neutral-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
    
    {/* 📌 Admin Dashboard Title */}
    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
      Admin Dashboard
    </h1>

    {/* 📌 Buttons: Add Police Station & Logout */}
    <div className="flex w-fit h-fit gap-4">
      <button
        onClick={() => navigate("/add-police-station")} // Change route accordingly
        className="px-4 py-2 flex items-center gap-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
      >
        {/* ➕ */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="w-5 h-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
         Add Police Station
      </button>

      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-900 rounded-lg hover:bg-neutral-800 border border-neutral-800 transition-all hover:border-neutral-700"
      >
        Logout
      </button>
    </div>

  </div>
</nav>




      {/* <nav className="border-b top-16 border-neutral-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-900 rounded-lg hover:bg-neutral-800 border border-neutral-800 transition-all hover:border-neutral-700"
          >
            Logout
          </button>
        </div>
      </nav> */}

      {/* Filters */}
      <main className="max-w-7xl mt-12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 flex-col md:flex-row w-full">
          <input
          type="text"
          placeholder="Search by Title or Police Station"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border text-sm w-full p-2 rounded w-1/3"
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
{
  reports  && ( 
    <div className="grid mt-12 gap-4 sm:grid-cols-1 md:grid-cols-2">
          {reports?.map((report) => (
            <div
              key={report.id}
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
                    <span>📍 {report.location || "N/A"}</span>
                    <span>📅 {new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>

                  {report.image && (
                    <img src={report.image} alt="Report" className="mt-4 w-[20rem] h-[20rem] object-cover rounded-lg border border-neutral-800" />
                  )}

                  {report.files?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="font-medium text-neutral-200">Download Evidence</h3>
                      <div className="space-y-2">
                        {report.files.map((file) => (
                          <a key={file.id} href={file.filePath} download className="text-blue-500 hover:underline">
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
                  onChange={(e) => updateReportStatus(report.id, e.target.value)}
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
        </div>) 
}
{reports.length === 0 && (
  <div className="flex flex-col mx-auto p-10 items-center justify-center min-h-screen bg-neutral-900/50 rounded-xl border border-neutral-800 text-neutral-400 py-12">
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
      No Reports Available
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

export default AdminDashboard;

// **
// import { useEffect, useState, useMemo } from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
// } from "@tanstack/react-table";
// import Card from "../../components/Card";
// import { useNavigate } from "react-router-dom";

// const AdminDashboard = () => {
//   const BASE_URL = "http://localhost:5000/api";
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/login");
//   };

//   const [reports, setReports] = useState([]);
//   const [filters, setFilters] = useState({
//     search: "",
//     status: "",
//     type: "",
//     page: 1,
//     limit: 10,
//   });

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const validFilters = Object.fromEntries(
//           Object.entries(filters).filter(([_, v]) => v !== "")
//         );
//         const queryParams = new URLSearchParams(validFilters).toString();

//         const response = await fetch(
//           `${BASE_URL}/report/reports/admin?${queryParams}`
//         );
//         const data = await response.json();
//         console.log("all reports admin", data);
//         setReports(data.reports || []);
//       } catch (error) {
//         console.error("Error fetching reports:", error);
//       }
//     };

//     fetchReports();
//   }, [filters]);

//   // 📌 Define Columns for React Table v8
//   const columns = useMemo(
//     () => [
//       { accessorKey: "_id", header: "ID" },
//       { accessorKey: "title", header: "Title" },
//       { accessorKey: "status", header: "Status" },
//       { accessorKey: "type", header: "Type" },
//       { accessorKey: "assignedStation.name", header: "Police Station" },
//     ],
//     []
//   );

//   // 📌 Initialize Table (✅ Fixed Syntax)
//   const table = useReactTable({
//     columns,
//     data: reports,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   return (
//     <div className="p-6 mt-16 w-full">
//     <div className="flex w-full flex-row justify-between mb-4 ">
//     <p className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard.</p>
//       <button
//         className="mt-4 text-left bg-red-500 px-4 py-2 rounded"
//         onClick={handleLogout}
//       >
//         Logout
//       </button>
//     </div>
     

//       {/* 📌 Filters Section */}
//       <div className="flex flex-col w-full md:flex-row justify-between gap-4 mb-4">
        // <input
        //   type="text"
        //   placeholder="Search by Title or Police Station"
        //   value={filters.search}
        //   onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        //   className="border w-full p-2 rounded w-1/3"
        // />

//         <select
//           value={filters.status}
//           onChange={(e) => setFilters({ ...filters, status: e.target.value })}
//           className="border w-full bg-black p-2 rounded w-1/4"
//         >
//           <option value="">All Status</option>
//           <option value="PENDING">Pending</option>
//           <option value="RESOLVED">Resolved</option>
//           <option value="IN_PROGRESS">In Progress</option>

//           <option value="DISMISSED">Rejected</option>
//         </select>

//         <select
//           value={filters.type}
//           onChange={(e) => setFilters({ ...filters, type: e.target.value })}
//           className="border w-full bg-black p-2 rounded w-1/4"
//         >
//           <option value="">All Types</option>
//           <option value="Theft">Theft</option>
//           <option value="Assault">Assault</option>
//           <option value="Fraud">Fraud</option>
//         </select>
//       </div>

//       {/* 📌 Reports Table */}
//       <Card title="Recent Reports">
//         <table className="w-full border-collapse border border-gray-200 mt-3">
//           <thead className="bg-black-600 w-full">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <tr key={headerGroup.id} className="border-b">
//                 {headerGroup.headers.map((header) => (
//                   <th key={header.id} className="p-3 text-left font-medium">
//                     {flexRender(header.column.columnDef.header, header.getContext())}
//                   </th>
//                 ))}
//               </tr>
//             ))}
//           </thead>
//           <tbody>
//             {table.getRowModel().rows.length > 0 ? (
//               table.getRowModel().rows.map((row) => (
//                 <tr key={row.id} className="border-b hover:bg-gray-50">
//                   {row.getVisibleCells().map((cell) => (
//                     <td key={cell.id} className="p-3">
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </td>
//                   ))}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={columns.length} className="text-center p-4 text-gray-500">
//                   No reports found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </Card>

//       {/* 📌 Pagination Controls */}
//       <div className="flex justify-end gap-3 mt-4">
//         <button
//           disabled={filters.page === 1}
//           onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <button
//           disabled={reports.length < filters.limit}
//           onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
//           className="px-3 py-1 border rounded"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
