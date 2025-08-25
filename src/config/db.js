import mongoose from "mongoose";

export async function connectDB(uri) {

  const mongoUri = uri || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB runtime error:", err);
  });
}