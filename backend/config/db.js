const mongoose = require("mongoose");

let isListenersAttached = false;

const attachConnectionListeners = () => {
  if (isListenersAttached) return;
  isListenersAttached = true;

  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connection established");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected. Mongoose will automatically attempt to reconnect...");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("🔄 MongoDB reconnected successfully");
  });
};

const connectDB = async (retryCount = 0) => {
  attachConnectionListeners();

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("❌ MONGO_URI or MONGODB_URI is not defined in environment variables.");
    return;
  }

  const maxRetries = 5;

  try {
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: process.env.NODE_ENV !== "production",
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);

    if (retryCount < maxRetries) {
      const waitTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
      console.log(`🔄 Retrying MongoDB connection in ${waitTime / 1000}s (Attempt ${retryCount + 1}/${maxRetries})...`);
      setTimeout(() => connectDB(retryCount + 1), waitTime);
    } else {
      console.warn("⚠️ Maximum initial MongoDB connection retries exceeded. The server will continue running and Mongoose will retry on demand.");
    }
  }
};

module.exports = connectDB;