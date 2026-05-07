import { Request, Response, NextFunction } from "express"
import { z } from "zod"

const toolSchema = z.object({
  code: z
    .string()
    .min(1, "Code cannot be empty")
    .max(10000, "Code too long — max 10,000 characters"),
  tool: z.enum(["debug", "explain", "convert", "complexity"]),
  provider: z.enum(["gemini", "openai", "groq"]),
  targetLanguage: z.string().optional()
})

export const validateToolRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const result = toolSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: result.error.errors[0].message
    })
    return
  }

  // Sanitize — remove potentially dangerous patterns
  const { code } = result.data
  const dangerous = /<script|javascript:|data:/gi
  if (dangerous.test(code)) {
    res.status(400).json({
      success: false,
      message: "Invalid code content detected"
    })
    return
  }

  req.body = result.data
  next()
}