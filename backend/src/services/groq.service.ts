import Groq from "groq-sdk"
import { ToolType, ToolResult } from "../types"
import { getSystemPrompt, getUserPrompt } from "../prompts"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ""
})

export const runGroq = async (
  tool: ToolType,
  code: string,
  targetLanguage?: string
): Promise<{ result: ToolResult; tokensUsed: number }> => {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile", // best free model on Groq
    messages: [
      {
        role: "system",
        content: getSystemPrompt(tool)
      },
      {
        role: "user",
        content: getUserPrompt(tool, code, targetLanguage)
      }
    ],
    temperature: 0.2,
    max_tokens: 2048,
    response_format: { type: "json_object" } // forces JSON output
  })

  const text = response.choices[0]?.message?.content || "{}"

  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim()

  const result = JSON.parse(cleaned) as ToolResult
  const tokensUsed = response.usage?.total_tokens || 0

  return { result, tokensUsed }
}