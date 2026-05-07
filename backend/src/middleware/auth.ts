import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

export interface AuthRequest extends Request {
  user?: any
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"] as string | undefined
    const token = authHeader?.split(" ")[1]

    if (!token) {
      res.status(401).json({ success: false, message: "Not authorized" })
      return
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as { id: string }

    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      res.status(401).json({ success: false, message: "User not found" })
      return
    }

    req.user = user
    next()
  } catch {
    res.status(401).json({ success: false, message: "Token invalid" })
  }
}