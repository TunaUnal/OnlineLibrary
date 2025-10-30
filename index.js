import express from "express";
import dotenv from "dotenv/config.js";
import cors from "cors";
const app = express();
import userRouter from "./routes/userRouter.js";
import authRouter from "./routes/authRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import fileRouter from "./routes/fileRouter.js";
import mainRouter from "./routes/mainRouter.js";
import { connectDB } from "./config/db.js";
import qs from "qs";
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/file", fileRouter);
app.use("/main", mainRouter);

app.get("/", (req, res) => {
  res.send("Hello World! 🌍");
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Server is running at http://localhost:${process.env.PORT}`);
});
