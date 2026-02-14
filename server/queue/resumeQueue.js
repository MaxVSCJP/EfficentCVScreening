import { Queue } from "bullmq";
import connection from "./connection";

export default resumeQueue = new Queue("pdf-processing", { connection });
