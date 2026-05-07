import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ToolType, AIProvider, ApiResponse, ToolResult } from "../types";
import { runGemini } from "../services/gemini.service";
import { runOpenAI } from "../services/openai.service";
import { runGroq } from "../services/groq.service";
import History from "../models/History";

export const runTool = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const code = req.body.code as string;
  const tool = req.body.tool as ToolType;
  const provider = req.body.provider as AIProvider;
  const targetLanguage = req.body.targetLanguage as string | undefined;

  try {
    // Basic validation
    if (!code || !tool || !provider) {
      res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
      return;
    }

    let result: ToolResult;
    let tokensUsed = 0;

    // Run selected AI provider

// Inside runTool function, update the if/else:
if (provider === "openai") {
  const output = await runOpenAI(tool, code, targetLanguage)
  result = output.result
  tokensUsed = output.tokensUsed
} else if (provider === "groq") {
  const output = await runGroq(tool, code, targetLanguage)
  result = output.result
  tokensUsed = output.tokensUsed
} else {
  const output = await runGemini(tool, code, targetLanguage)
  result = output.result
  tokensUsed = output.tokensUsed
}

    // Save history
    if (req.user?._id) {
      await History.create({
        userId: req.user._id,
        tool,
        provider,
        code: code.slice(0, 500),
        result,
        tokensUsed,
        targetLanguage
      });
    }

    const response: ApiResponse<ToolResult> = {
      success: true,
      tool,
      provider,
      data: result,
      message: "Analysis complete",
      tokensUsed
    };

    res.status(200).json(response);

  } catch (error: any) {
    console.error(`Tool error [${tool}][${provider}]:`, error);

    // AI returned invalid JSON
    if (error instanceof SyntaxError) {
      res.status(500).json({
        success: false,
        tool,
        provider,
        message: "AI returned malformed response. Try again."
      });
      return;
    }

    // OpenAI quota exceeded
    if (
      error?.status === 429 ||
      error?.code === "insufficient_quota"
    ) {
      res.status(429).json({
        success: false,
        tool,
        provider,
        message:
          "AI quota exceeded. Please try again later or switch provider."
      });
      return;
    }

    // Invalid API key
    if (error?.status === 401 || error?.status === 403) {
      res.status(401).json({
        success: false,
        tool,
        provider,
        message: "Invalid or restricted API key."
      });
      return;
    }

    // Invalid model
    if (error?.status === 404) {
      res.status(404).json({
        success: false,
        tool,
        provider,
        message: "Requested AI model not available."
      });
      return;
    }

    // Generic fallback
    res.status(500).json({
      success: false,
      tool,
      provider,
      message: "Something went wrong. Try again."
    });
  }
};