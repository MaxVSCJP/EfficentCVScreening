import {
  createJobService,
  getJobsService,
  getJobByIdService,
  updateJobService,
  deleteJobService
} from "../services/jobService.js";


export const createJob = async (req, res) => {
  try {
    console.log("Received job creation request with data:", req.body);
    const job = await createJobService(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await getJobsService();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await getJobByIdService(req.params.id);
    res.json(job);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await updateJobService(req.params.id, req.body);
    res.json(job);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const result = await deleteJobService(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
