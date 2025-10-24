import express from "express";
import dotenv from "dotenv/config.js";

const app = express();
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
app.use(express.json());
import { connectDB } from "./config/db.js";
connectDB();

app.use("/user", userRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World! 🌍");
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Server is running at http://localhost:${process.env.PORT}`);
});
