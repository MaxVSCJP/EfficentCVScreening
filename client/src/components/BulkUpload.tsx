import React, { useState, useEffect } from 'react';
import { UploadCloud, X, CheckCircle2, Loader2, Briefcase } from 'lucide-react';
import { uploadResumesApi, getJobsApi } from '../api/screening';
import type { Candidate } from '../types';

interface BulkUploadProps {
  activeJobId: string | number | null;
  setActiveJobId: (id: string | number) => void;
  setTopCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const BulkUpload: React.FC<BulkUploadProps> = ({ activeJobId, setActiveJobId, setTopCandidates, setLoading }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [availableJobs, setAvailableJobs] = useState<{ _id: string; title: string }[]>([]);

  // Fetch jobs from database when component mounts or a new job is added
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await getJobsApi();
        setAvailableJobs(jobs);
      } catch (error) {
        console.error("Failed to load jobs");
      }
    };
    fetchJobs();
  }, [activeJobId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f => f.type === "application/pdf");
      setFiles(prev => [...prev, ...selected]);
    }
  };

  const handleProcess = async () => {
    if (!activeJobId || files.length === 0) return;
    setLoading(true);
    setIsUploading(true);
    try {
      const data = await uploadResumesApi(activeJobId, files, (p) => setUploadProgress(p));
      setTopCandidates(data.topCandidates || []);
      setFiles([]);
    } catch (error) {
      alert("AI Screening failed. Please try again.");
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
        2. Upload & Screen
      </h2>

      {/* NEW: Job Selector Dropdown */}
      <div className="mb-4">
        <label htmlFor="jobSelect" className="block text-[10px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
          <Briefcase size={10} /> Select Job to Screen For
        </label>
        <select
          id="jobSelect"
          value={activeJobId || ''}
          onChange={(e) => setActiveJobId(e.target.value)}
          title="Select a job"
          className="w-full p-2 bg-blue-50 border border-blue-100 rounded-lg text-sm font-medium text-blue-700 outline-none"
        >
          <option value="" disabled>-- Choose a Job --</option>
          {availableJobs.map((job) => (
            <option key={job._id} value={job._id}>{job.title}</option>
          ))}
        </select>
      </div>

      <label 
        className={`group border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          !activeJobId ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed' : 'border-slate-200 hover:border-blue-400'
        }`}
      >
        <UploadCloud className={activeJobId ? "text-blue-600 mb-2" : "text-slate-300 mb-2"} size={32} />
        <span className="text-[10px] font-bold text-slate-500 uppercase">
          {activeJobId ? "Select PDF Resumes" : "Select a Job Above First"}
        </span>
        <input 
          type="file" multiple accept=".pdf" className="hidden" 
          onChange={handleFileChange} disabled={!activeJobId} 
        />
      </label>

      {/* File list preview */}
      {files.length > 0 && (
        <div className="mt-4 space-y-1">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded text-[10px] border border-slate-100">
              <span className="truncate max-w-[180px]">{file.name}</span>
              <button type="button" title="Remove" onClick={() => setFiles(f => f.filter((_, idx) => idx !== i))}>
                <X size={12} className="text-slate-400 hover:text-red-500"/>
              </button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div className="mt-4 w-full bg-slate-100 h-1 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}

      <button 
        type="button" 
        disabled={files.length === 0 || isUploading || !activeJobId} 
        onClick={handleProcess} 
        className={`w-full mt-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
          files.length > 0 && activeJobId ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' : 'bg-slate-100 text-slate-400'
        }`}
      >
        {isUploading ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle2 size={18}/>}
        {isUploading ? "Processing..." : "Rank Candidates"}
      </button>
    </div>
  );
};

export default BulkUpload;