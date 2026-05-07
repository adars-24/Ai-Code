import axios from "axios"
import {
 type ToolType,
  type AIProvider,
 type ApiResponse,
  type ToolResult,
 type AuthResponse,
  type IHistory
} from "../types"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 30000
})

// Attach token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const runTool = async (
  code: string,
  tool: ToolType,
  provider: AIProvider,
  targetLanguage?: string
): Promise<ApiResponse<ToolResult>> => {
  const { data } = await api.post<ApiResponse<ToolResult>>("/ai/run", {
    code,
    tool,
    provider,
    targetLanguage
  })
  return data
}

export const loginUser = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await api.post<ApiResponse<AuthResponse>>("/auth/login", {
    email,
    password
  })
  return data
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  const { data } = await api.post<ApiResponse<AuthResponse>>(
    "/auth/register",
    { name, email, password }
  )
  return data
}

export const fetchHistory = async (): Promise<ApiResponse<IHistory[]>> => {
  const { data } = await api.get<ApiResponse<IHistory[]>>("/history")
  return data
}

export const deleteHistoryItem = async (id: string): Promise<void> => {
  await api.delete(`/history/${id}`)
}

export const clearAllHistory = async (): Promise<void> => {
  await api.delete("/history/clear")
}