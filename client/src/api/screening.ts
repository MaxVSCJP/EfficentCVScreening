import axios from 'axios';
import type { ScreeningCriteria, Candidate } from '../types';

const BACKEND_ORIGIN = 'http://localhost:5000';

export const saveRequirementsApi = async (criteria: ScreeningCriteria): Promise<{ jobId: string | number }> => {
  console.log("Saving criteria to backend:", criteria);
  const response = await axios.post(`${BACKEND_ORIGIN}/api/jobs`, criteria);
  return response.data;
};

export const uploadResumesApi = async (
  jobId: string | number,
  files: File[],
  onProgress: (percent: number) => void
): Promise<{ topCandidates: Candidate[] }> => {
  const formData = new FormData();
  formData.append('jobId', jobId.toString());
  files.forEach(file => formData.append('resumes', file));

  const response = await axios.post(`${BACKEND_ORIGIN}/api/resumes/upload/${jobId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return response.data;
};