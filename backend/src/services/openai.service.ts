import OpenAI from "openai"
import { ToolType, ToolResult } from "../types"
import { getSystemPrompt, getUserPrompt } from "../prompts"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
})

export const runOpenAI = async (
  tool: ToolType,
  code: string,
  targetLanguage?: string
): Promise<{ result: ToolResult; tokensUsed: number }> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // cheap and fast, good for code tasks
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
    response_format: { type: "json_object" }, // forces JSON output
    temperature: 0.2 // low temperature for consistent structured output
  })

  const text = response.choices[0]?.message?.content || "{}"
  const result = JSON.parse(text) as ToolResult
  const tokensUsed = response.usage?.total_tokens || 0

  return { result, tokensUsed }
}