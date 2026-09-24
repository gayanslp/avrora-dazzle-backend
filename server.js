import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cartRoutes from "./routes/cartroutes.js";
import authRouter from "./routes/authRoutes.js";
import bodyParser from "body-parser";


dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));





app.get("/", (req, res) => {
  res.send("Hello, World!");
});

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("MongoDB connected");
  }).catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });


  app.use("/api/auth", authRouter);
  app.use("/api/cart", cartRoutes);

  const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});