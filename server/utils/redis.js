const { Redis } = require("ioredis");

export default connection = new Redis({
  host: "127.0.0.1",
  port: 6379,
});
