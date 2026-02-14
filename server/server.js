import "dotenv/config";

import app from "./app.js";
import connectDB from "./utils/db.js";

const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT, () => {
    console.log(`Server is up and running on port ${process.env.PORT}`);
  });
};

startServer();
