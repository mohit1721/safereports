import React, { useState } from "react";
import ReportForm from "./ReportForm";
import ReportFormSubmitted from "./ReportFormSubmitted";

export default function ReportWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState(null);

  const handleStepComplete = async (data) => {
    setReportData({ ...reportData, ...data }); // Merge new data into reportData
    if (currentStep === 3) return;
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <div className="rounded-2xl bg-zinc-900 p-5">
      {currentStep === 1 && <ReportForm onComplete={handleStepComplete} />}
      {currentStep === 2 && <ReportFormSubmitted data={reportData} onComplete={handleStepComplete} />}
    </div>
  );
}
