import axios from 'axios';
import type { ScreeningCriteria, Candidate } from '../types';

const BACKEND_ORIGIN = 'http://localhost:5000';

// 1. Save new job criteria
export const saveRequirementsApi = async (criteria: ScreeningCriteria): Promise<{ jobId: string | number }> => {
  console.log("Saving criteria to backend:", criteria);
  const response = await axios.post(`${BACKEND_ORIGIN}/api/jobs`, criteria);
  return response.data;
};

// 2. NEW: Fetch all jobs for the dropdown selector
export const getJobsApi = async (): Promise<{ _id: string; title: string }[]> => {
  const response = await axios.get(`${BACKEND_ORIGIN}/api/jobs`);
  return response.data;
};

// 3. Upload resumes linked to a specific jobId
export const uploadResumesApi = async (
  jobId: string | number,
  files: File[],
  onProgress: (percent: number) => void
): Promise<{ topCandidates: Candidate[] }> => {
  const formData = new FormData();
  formData.append('jobId', jobId.toString());
  files.forEach(file => formData.append('resume', file));

  const response = await axios.post(`${BACKEND_ORIGIN}/api/resumes/upload/${jobId}`, formData, {
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return response.data;
};