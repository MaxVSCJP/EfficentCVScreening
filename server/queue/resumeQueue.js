import { Queue } from "bullmq";
import connection from "../utils/redis.js";

const resumeQueue = new Queue("pdf-processing", { connection });

export default resumeQueue;
