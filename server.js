import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();



app.get("/", (req, res) => {
  res.send("Hello, World!");
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB connected");
  }).catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });

  const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});