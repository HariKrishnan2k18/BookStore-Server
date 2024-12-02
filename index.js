import connectDB from "./Database/config.js";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();

app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

connectDB();

app.use("/login", authRoutes);
app.use("/books", bookRoutes);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
