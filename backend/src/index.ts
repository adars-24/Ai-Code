import * as dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
// import * as dotenv from "dotenv";
import mongoose from "mongoose";
import aiRoutes from "./routes/ai.routes";
import authRoutes from "./routes/auth.routes";
import historyRoutes from "./routes/history.routes";

// dotenv.config();
console.log("ENV KEY:", process.env.GEMINI_API_KEY);

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "3000");

app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL || ""],
    credentials: true,
  }),
);

app.use(express.json({ limit: "50kb" }));

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "AI Dev Tools API v2.0" });
});

app.use("/auth", authRoutes);
app.use("/ai", aiRoutes);
app.use("/history", historyRoutes);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
