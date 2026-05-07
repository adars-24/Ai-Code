import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import User, { IUser } from "../models/User"
import { ApiResponse, AuthResponse } from "../types"

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "30d"
  })
}

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: "All fields required"
      })
      return
    }

    const exists = await User.findOne({ email })
    if (exists) {
      res.status(400).json({
        success: false,
        message: "Email already registered"
      })
      return
    }

    const user: IUser = await User.create({ name, email, password })
    const token = generateToken(user._id.toString())

    const response: ApiResponse<AuthResponse> = {
      success: true,
      tool: "debug",
      provider: "gemini",
      data: { token, name: user.name, email: user.email },
      message: "Registered successfully"
    }

    res.status(201).json(response)
  } catch {
    res.status(500).json({ success: false, message: "Server error" })
  }
}

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password required"
      })
      return
    }

    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      })
      return
    }

    const token = generateToken(user._id.toString())

    const response: ApiResponse<AuthResponse> = {
      success: true,
      tool: "debug",
      provider: "gemini",
      data: { token, name: user.name, email: user.email },
      message: "Login successful"
    }

    res.status(200).json(response)
  } catch {
    res.status(500).json({ success: false, message: "Server error" })
  }
}