import { ToolType } from "../types"

export const getSystemPrompt = (tool: ToolType): string => {
  const prompts: Record<ToolType, string> = {
    debug: `You are a senior software engineer specializing in debugging. 
Analyze the provided code and respond ONLY with a valid JSON object — no markdown, no explanation outside the JSON.
Response format:
{
  "hasErrors": boolean,
  "errors": [
    {
      "line": number or null,
      "description": "clear description of the error",
      "severity": "critical" | "warning" | "info"
    }
  ],
  "fixedCode": "complete corrected code here",
  "explanation": "clear explanation of what was wrong and why",
  "improvements": ["improvement 1", "improvement 2"]
}`,

    explain: `You are a senior developer and technical educator.
Analyze the provided code and respond ONLY with a valid JSON object — no markdown, no explanation outside the JSON.
Response format:
{
  "summary": "one paragraph summary of what this code does",
  "breakdown": [
    {
      "section": "section name or line range",
      "explanation": "what this section does"
    }
  ],
  "concepts": ["concept1", "concept2"],
  "difficulty": "beginner" | "intermediate" | "advanced"
}`,

    convert: `You are an expert polyglot programmer who converts code between languages precisely.
Analyze the provided code and respond ONLY with a valid JSON object — no markdown, no explanation outside the JSON.
Response format:
{
  "convertedCode": "complete converted code here",
  "notes": ["note about conversion decision 1", "note 2"],
  "warnings": ["potential issue in converted code 1"]
}`,

    complexity: `You are a computer science expert specializing in algorithm analysis.
Analyze the provided code and respond ONLY with a valid JSON object — no markdown, no explanation outside the JSON.
Response format:
{
  "timeComplexity": "O(n) — or whatever is correct",
  "spaceComplexity": "O(1) — or whatever is correct",
  "explanation": "detailed explanation of why this complexity",
  "bottlenecks": ["bottleneck description 1", "bottleneck 2"],
  "suggestions": ["optimization suggestion 1", "suggestion 2"],
  "rating": "excellent" | "good" | "fair" | "poor"
}`
  }

  return prompts[tool]
}

export const getUserPrompt = (
  tool: ToolType,
  code: string,
  targetLanguage?: string
): string => {
  if (tool === "convert") {
    return `Convert this code to ${targetLanguage || "Python"}:\n\n${code}`
  }
  return `Analyze this code:\n\n${code}`
}