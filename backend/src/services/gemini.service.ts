import { GoogleGenerativeAI } from "@google/generative-ai";
import { ToolType, ToolResult } from "../types";
import { getSystemPrompt, getUserPrompt } from "../prompts";

export const runGemini = async (
  tool: ToolType,
  code: string,
  targetLanguage?: string,
): Promise<{ result: ToolResult; tokensUsed: number }> => {

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing Gemini API key");
  }

  console.log("Gemini key loaded:", apiKey ? "YES" : "NO");

  // Initialize INSIDE function
  const genAI = new GoogleGenerativeAI(apiKey);



  // SAFEST MODEL FOR YOUR SDK
  const model = genAI.getGenerativeModel({
model: "gemini-2.0-flash"
  });

  // Combine prompts manually
  const prompt = `
${getSystemPrompt(tool)}

${getUserPrompt(tool, code, targetLanguage)}
`;

  try {
    const response = await model.generateContent(prompt);

    const text = response.response.text();

    // Remove markdown wrappers
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    let result: ToolResult;

    try {
      result = JSON.parse(cleaned) as ToolResult;
    } catch {
      console.error("Invalid Gemini JSON:", cleaned);
      throw new SyntaxError("AI returned invalid JSON");
    }

    const tokensUsed =
      response.response.usageMetadata?.totalTokenCount || 0;

    return {
      result,
      tokensUsed,
    };

  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
};