import { Response } from "express"
import { AuthRequest } from "../middleware/auth"
import History from "../models/History"

export const getHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const history = await History.find({ userId: req.user?._id })
      .sort({ createdAt: -1 })
      .limit(20)

    res.status(200).json({
      success: true,
      data: history,
      message: "History fetched"
    })
  } catch {
    res.status(500).json({ success: false, message: "Server error" })
  }
}

export const deleteHistory = async (
  req: AuthRequest & { params: { id: string } },
  res: Response
): Promise<void> => {
  try {
    await History.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?._id
    })
    res.status(200).json({ success: true, message: "Deleted" })
  } catch {
    res.status(500).json({ success: false, message: "Server error" })
  }
}

export const clearHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    await History.deleteMany({ userId: req.user?._id })
    res.status(200).json({ success: true, message: "History cleared" })
  } catch {
    res.status(500).json({ success: false, message: "Server error" })
  }
}