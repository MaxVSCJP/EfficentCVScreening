import React, { useState } from "react";
import CriteriaForm from "./components/CriteriaForm";
import BulkUpload from "./components/BulkUpload";
import ResultsTable from "./components/ResultsTable";
import type { ScreeningCriteria, Candidate } from "./types";

const App = () => {
  const [criteria, setCriteria] = useState<ScreeningCriteria>({
    title: "",
    description: "",
    skills: {}, // FIX: Initialized as object for weighted skills
    workExperienceYears: 0,
    eduacationLevel: 1,
    educationField: "",
    rankLimit: 5,
  });

  const [activeJobId, setActiveJobId] = useState<string | number | null>(null);
  const [topCandidates, setTopCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        <div className="col-span-4 space-y-6">
          <CriteriaForm
            criteria={criteria}
            setCriteria={setCriteria}
            onSaveSuccess={(id) => setActiveJobId(id)}
          />
          <BulkUpload
            activeJobId={activeJobId}
            setActiveJobId={setActiveJobId} // Pass setter to allow manual selection
            setTopCandidates={setTopCandidates}
            setLoading={setLoading}
          />
        </div>
        <div className="col-span-8">
          <ResultsTable
            data={topCandidates}
            loading={loading}
            requestedRank={criteria.rankLimit}
          />
        </div>
      </div>
    </div>
  );
};

export default App;