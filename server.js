import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import cartRoutes from "./routes/cartroutes.js";
import authRouter from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoutes.js";
import coupenRouter from "./routes/coupenRoutes.js";


dotenv.config();
const app = express();

const appLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later."
  }
});

app.use(appLimiter);
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
  app.use("/api/user", userRouter);
  app.use("/api/coupen", coupenRouter);
  const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});