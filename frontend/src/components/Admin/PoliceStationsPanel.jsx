import { useEffect, useState } from "react";
import axios from "axios";
import { TableSkeleton } from "../ui/Skeletons";

const PoliceStationsPanel = ({ refreshKey = 0 }) => {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "https://safereports.onrender.com/api";
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [data, setData] = useState({ totalStations: 0, policeStations: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const { data: res } = await axios.get(
          `${BASE_URL}/admin/police-stations?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (active) setData({ totalStations: res.totalStations || 0, policeStations: res.policeStations || [] });
      } catch (error) {
        console.error("Error fetching police stations:", error);
      } finally {
        if (active) setIsLoading(false);
      }
    }, 400);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [search, page, limit, refreshKey, BASE_URL]);

  const totalPages = Math.max(1, Math.ceil(data.totalStations / limit));

  return (
    <div className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 backdrop-blur-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-neutral-200">
          Police Stations
          <span className="ml-2 rounded-full bg-sky-500/10 px-2 py-0.5 text-xs text-sky-400 ring-1 ring-sky-500/20">
            {isLoading ? "..." : data.totalStations}
          </span>
        </h2>
        <input
          type="text"
          placeholder="Quick search (name, email, district, state)..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 sm:max-w-xs"
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-800 text-xs uppercase tracking-wide text-neutral-500">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">District</th>
              <th className="py-2">State</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <TableSkeleton rows={5} cols={4} />}
            {data.policeStations.map((station) => {
               if (!station?._id) return null;
              return (
                <tr key={station?._id} className="border-b border-neutral-800/60">
                  <td className="py-2.5 pr-4 text-neutral-300">{station?.name}</td>
                  <td className="py-2.5 pr-4 text-neutral-300">{station?.email}</td>
                  <td className="py-2.5 pr-4 text-neutral-300">{station?.district}</td>
                  <td className="py-2.5">
                    {station?.isCentral ? (
                      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400 ring-1 ring-green-500/20">
                        {station?.state} (Central)
                      </span>
                    ) : (
                      <span className="text-neutral-300">{station?.state}</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {!isLoading && data.policeStations.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-neutral-500">
                  No police stations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-neutral-500">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-md border border-neutral-700 px-3 py-1 text-xs text-neutral-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={page >= totalPages}
            className="rounded-md border border-neutral-700 px-3 py-1 text-xs text-neutral-300 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoliceStationsPanel;
