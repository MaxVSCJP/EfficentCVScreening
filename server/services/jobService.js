import Job from "../models/JobModel.js";


export const createJobService = async (jobData) => {
  const job = await Job.create(jobData);
  return job;
};


export const getJobsService = async () => {
  const jobs = await Job.find();
  return jobs;
};

export const getJobByIdService = async (id) => {
  const job = await Job.findById(id);
  if (!job) throw new Error("Job not found");
  return job;
};

export const updateJobService = async (id, updateData) => {
  const job = await Job.findByIdAndUpdate(id, updateData, { new: true });
  if (!job) throw new Error("Job not found");
  return job;
};

export const deleteJobService = async (id) => {
  const job = await Job.findByIdAndDelete(id);
  if (!job) throw new Error("Job not found");
  return { message: "Job deleted successfully" };
};
