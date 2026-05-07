export type ToolType = "debug" | "explain" | "convert" | "complexity";
export type AIProvider = "gemini" | "openai" | "groq";

export interface ToolRequest {
  code: string;
  tool: ToolType;
  provider: AIProvider;
  targetLanguage?: string;
}

export interface DebugError {
  line?: number;
  description: string;
  severity: "critical" | "warning" | "info";
}

export interface DebugResult {
  hasErrors: boolean;
  errors: DebugError[];
  fixedCode: string;
  explanation: string;
  improvements: string[];
}

export interface ExplainResult {
  summary: string;
  breakdown: { section: string; explanation: string }[];
  concepts: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface ConvertResult {
  convertedCode: string;
  notes: string[];
  warnings: string[];
}

export interface ComplexityResult {
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  bottlenecks: string[];
  suggestions: string[];
  rating: "excellent" | "good" | "fair" | "poor";
}

export type ToolResult =
  | DebugResult
  | ExplainResult
  | ConvertResult
  | ComplexityResult;

export interface ApiResponse<T> {
  success: boolean;
  tool: ToolType;
  provider: AIProvider;
  data?: T;
  message: string;
  tokensUsed?: number;
}

export interface Tab {
  id: ToolType;
  label: string;
  icon: string;
  description: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
}

export interface IHistory {
  _id: string;
  userId: string;
  tool: ToolType;
  provider: AIProvider;
  code: string;
  result: ToolResult;
  tokensUsed: number;
  language?: string;
  targetLanguage?: string;
  createdAt: Date;
}
