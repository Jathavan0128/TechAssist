// config/db.js
import mongoose from "mongoose";

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000;

const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error("MONGO_URI not provided");
  }

  let attempts = 0;

  const connect = async () => {
    try {
      attempts++;
      await mongoose.connect(mongoUri);
    } catch (err) {
      if (attempts < MAX_RETRIES) {
        await new Promise((res) => setTimeout(res, RETRY_DELAY));
        return connect();
      }
      process.exit(1);
    }
  };

  return connect();
};

export default connectDB;
