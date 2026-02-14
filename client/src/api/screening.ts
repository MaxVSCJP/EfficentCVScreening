import axios from 'axios';
import type { ScreeningCriteria, Candidate } from '../types';

export const saveRequirementsApi = async (criteria: ScreeningCriteria): Promise<{ jobId: string | number }> => {
  const response = await axios.post('/api/jobs', criteria);
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

  const response = await axios.post(`/api/jobs/${jobId}/screen`, formData, {
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