import { useEffect, useState, useMemo } from "react";
import { useReactTable } from "@tanstack/react-table";
import Card from "../../components/Card";

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    search: "", // ✅ Fixed missing state
    status: "",
    type: "",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // ✅ Removing empty filter values to avoid unnecessary params
        const validFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""));
        const queryParams = new URLSearchParams(validFilters).toString();
        
        const response = await fetch(`/api/reports?${queryParams}`);
        const data = await response.json();
        setReports(data.reports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [filters]); // ✅ Refetch on filter change

  // 📌 Define Columns for React Table
  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "_id" },
      { Header: "Title", accessor: "title" },
      { Header: "Status", accessor: "status" },
      { Header: "Type", accessor: "type" },
      { Header: "Police Station", accessor: "assignedStation.name" },
    ],
    []
  );

  // 📌 Initialize Table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useReactTable({
    columns,
    data: reports,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* 📌 Filters Section */}
      <div className="flex gap-4 mb-4">
        {/* ✅ Single Search Input for Report Title & Police Station Name */}
        <input
          type="text"
          placeholder="Search by Title or Police Station"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border p-2 rounded w-1/3"
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded w-1/4"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="border p-2 rounded w-1/4"
        >
          <option value="">All Types</option>
          <option value="Theft">Theft</option>
          <option value="Assault">Assault</option>
          <option value="Fraud">Fraud</option>
        </select>
      </div>

      {/* 📌 Reports Table */}
      <Card title="Recent Reports">
        <table {...getTableProps()} className="w-full border-collapse border border-gray-200 mt-3">
          <thead className="bg-gray-100">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="border-b">
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()} className="p-3 text-left font-medium">
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="border-b hover:bg-gray-50">
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="p-3">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center p-4 text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* 📌 Pagination Controls */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          disabled={filters.page === 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={reports.length < filters.limit} // ✅ Disable if no more reports
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
