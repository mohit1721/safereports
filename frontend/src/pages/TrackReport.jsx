import React from "react";
import ReportTracker from "../components/report/ReportTracker";
import { useNavigate } from "react-router-dom";

const TrackReport = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 cursor-pointer rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
          >
            ← Back
          </button>
          <ReportTracker />
        </div>
      </div>
    </div>
  );
};

export default TrackReport;
