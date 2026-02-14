import React, { useState } from 'react';
import { UploadCloud, X, CheckCircle2, Loader2 } from 'lucide-react';
import { uploadResumesApi } from '../api/screening';
import type { Candidate } from '../types';

interface BulkUploadProps {
  jobId: string | number | null;
  setTopCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const BulkUpload: React.FC<BulkUploadProps> = ({ jobId, setTopCandidates, setLoading }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f => f.type === "application/pdf");
      setFiles(prev => [...prev, ...selected]);
    }
  };

  const handleProcess = async () => {
    if (!jobId || files.length === 0) return;
    setLoading(true);
    setIsUploading(true);
    try {
      const data = await uploadResumesApi(jobId, files, (p) => setUploadProgress(p));
      setTopCandidates(data.topCandidates || []);
      setFiles([]);
    } catch (error) {
      alert("Upload failed.");
    } finally {
      setLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-slate-200 transition-all ${!jobId ? 'opacity-40 grayscale pointer-events-none' : 'opacity-100'}`}>
      <h2 className="text-lg font-bold mb-4 text-slate-800">2. Upload Candidate CVs</h2>
      <label className="group border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400">
        <UploadCloud className="text-blue-600 mb-2" size={32} />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select PDF Resumes</span>
        <input type="file" multiple accept=".pdf" className="hidden" onChange={handleFileChange} />
      </label>

      {files.length > 0 && (
        <div className="mt-4 space-y-1">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded text-[10px] font-medium">
              <span className="truncate max-w-[180px]">{file.name}</span>
              <button type="button" aria-label="Remove file" onClick={() => setFiles(f => f.filter((_, idx) => idx !== i))}>
                <X size={12} className="text-slate-400 hover:text-red-500"/>
              </button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div className="mt-4"><div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden"><div className="bg-blue-600 h-full transition-all" style={{ width: `${uploadProgress}%` }} /></div></div>
      )}

      <button type="button" disabled={files.length === 0 || isUploading} onClick={handleProcess} className={`w-full mt-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${files.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-400'}`}>
        {isUploading ? <Loader2 className="animate-spin" size={18}/> : <CheckCircle2 size={18}/>}
        {isUploading ? "AI Screening..." : "Rank Candidates"}
      </button>
    </div>
  );
};

export default BulkUpload;