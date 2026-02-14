import { useCallback, useState } from "react";
import CriteriaForm from "./components/CriteriaForm";
import BulkUpload from "./components/BulkUpload";
import ResultsTable from "./components/ResultsTable";
import type { ScreeningCriteria, Candidate } from "./types";
import { getRankedResumesApi } from "./api/screening";

const App = () => {
  const [criteria, setCriteria] = useState<ScreeningCriteria>({
    title: "",
    description: "",
    skills: {}, 
    workExperienceYears: 0,
    eduacationLevel: 1,
    educationField: "",
    rankLimit: 5,
  });

  const [activeJobId, setActiveJobId] = useState<string | number | null>(null);
  const [topCandidates, setTopCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRankedResumes = useCallback(async () => {
    if (!activeJobId) return;

    setLoading(true);
    try {
      const resumes = await getRankedResumesApi(activeJobId);
      const mappedCandidates: Candidate[] = resumes.map((resume) => ({
        name: resume.name || "Unknown Candidate",
        score: Math.round((resume.averageScore ?? 0) * 10),
        eduLevel: "N/A",
        eduBackground: `Education Score: ${resume.educationScore ?? 0}/10`,
        email: resume.email,
      }));
      setTopCandidates(mappedCandidates);
    } catch (error) {
      console.error("Failed to fetch ranked resumes", error);
      setTopCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [activeJobId]);

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
            setActiveJobId={setActiveJobId} 
            setTopCandidates={setTopCandidates}
            setLoading={setLoading}
            onUploadComplete={fetchRankedResumes}
          />
        </div>
        <div className="col-span-8">
          <ResultsTable
            data={topCandidates}
            loading={loading}
            requestedRank={criteria.rankLimit}
            onRefresh={fetchRankedResumes}
            canRefresh={Boolean(activeJobId)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;