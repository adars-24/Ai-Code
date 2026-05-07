import mongoose, { Document, Schema } from "mongoose";
import { ToolType, AIProvider, ToolResult } from "../types";

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  tool: ToolType;
  provider: AIProvider;
  code: string;
  result: ToolResult;
  tokensUsed: number;
  language?: string;
  targetLanguage?: string;
  createdAt: Date;
}

const HistorySchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tool: {
      type: String,
      enum: ["debug", "explain", "convert", "complexity"],
      required: true,
    },
    provider: {
      type: String,
      enum: ["gemini", "openai", "groq"],
      required: true,
    },
    // Store only first 500 chars of code for preview
    code: { type: String, required: true },
    result: { type: Schema.Types.Mixed, required: true },
    tokensUsed: { type: Number, default: 0 },
    language: { type: String },
    targetLanguage: { type: String },
  },
  { timestamps: true },
);

// Index for fast user history queries
HistorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IHistory>("History", HistorySchema);
