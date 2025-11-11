const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    mongoose.set("strictQuery", true);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MONGO DB CONNECTED: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Mongo connection error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  connectDB,
};
