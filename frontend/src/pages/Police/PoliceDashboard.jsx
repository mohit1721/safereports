import { useEffect, useState, useMemo } from "react";
import { useReactTable } from "@tanstack/react-table";
import Card from "../../components/Card";

const PoliceDashboard = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  // 📌 Fetch Reports
  const fetchReports = async () => {
    try {
      const response = await fetch("/api/police-reports");
      const data = await response.json();
      setReports(data.reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  // 📌 Update Report Status
  const updateStatus = async (reportId, newStatus) => {
    try {
      const response = await fetch(`/api/update-report-status/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        setReports((prevReports) =>
          prevReports.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
        );
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  // 📌 Table Columns
  const columns = useMemo(
    () => [
      { Header: "Report ID", accessor: "id" },
      { Header: "Title", accessor: "title" },
      { Header: "Status", accessor: "status" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">
              View
            </button>
            <select
              value={row.original.status}
              onChange={(e) => updateStatus(row.original.id, e.target.value)}
              className="border p-1 rounded-md"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="DISMISSED">Dismissed</option>
            </select>
          </div>
        ),
      },
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
      <h1 className="text-2xl font-bold mb-4">Police Dashboard</h1>

      {/* 📌 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Total Reports">
          <p className="text-gray-700">{reports.length}</p>
        </Card>
        <Card title="Pending Reports">
          <p className="text-orange-600 font-semibold">
            {reports.filter((r) => r.status === "PENDING").length}
          </p>
        </Card>
        <Card title="Resolved Reports">
          <p className="text-green-600 font-semibold">
            {reports.filter((r) => r.status === "RESOLVED").length}
          </p>
        </Card>
      </div>

      {/* 📌 Reports Table */}
      <Card title="Recent Reports">
        <table {...getTableProps()} className="w-full border-collapse border border-gray-300 mt-3">
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
                      <td {...cell.getCellProps()} className="p-3">{cell.render("Cell")}</td>
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
    </div>
  );
};

export default PoliceDashboard;
