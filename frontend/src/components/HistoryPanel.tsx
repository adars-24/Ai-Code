import { useState, useEffect } from "react"
import { fetchHistory, deleteHistoryItem, clearAllHistory } from "../api"
import {type IHistory, type ToolType } from "../types"
import toast from "react-hot-toast"

interface Props {
  onSelect: (item: IHistory) => void
  refreshTrigger: number
}

const toolIcons: Record<ToolType, string> = {
  debug: "🐛",
  explain: "📖",
  convert: "🔄",
  complexity: "⏱"
}

const HistoryPanel = ({ onSelect, refreshTrigger }: Props) => {
  const [history, setHistory] = useState<IHistory[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadHistory()
  }, [refreshTrigger])

  const loadHistory = async (): Promise<void> => {
    try {
      const res = await fetchHistory()
      if (res.success && res.data) {
        setHistory(res.data)
      }
    } catch {
      // silently fail — history is non-critical
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (
    e: React.MouseEvent,
    id: string
  ): Promise<void> => {
    e.stopPropagation()
    try {
      await deleteHistoryItem(id)
      setHistory(prev => prev.filter(h => h._id !== id))
      toast.success("Deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  const handleClear = async (): Promise<void> => {
    if (!confirm("Clear all history?")) return
    try {
      await clearAllHistory()
      setHistory([])
      toast.success("History cleared")
    } catch {
      toast.error("Failed to clear")
    }
  }

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (loading) {
    return (
      <div className="history-panel">
        <div className="history-header">
          <span className="history-title">Recent</span>
        </div>
        {[1,2,3].map(i => (
          <div key={i} className="skeleton" style={{
            height: "52px",
            margin: "4px 0",
            borderRadius: "8px"
          }} />
        ))}
      </div>
    )
  }

  return (
    <div className="history-panel">
      <div className="history-header">
        <span className="history-title">Recent</span>
        {history.length > 0 && (
          <button className="clear-btn" onClick={handleClear}>
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          No history yet
        </div>
      ) : (
        <div className="history-list">
          {history.map(item => (
            <div
              key={item._id}
              className="history-item"
              onClick={() => onSelect(item)}
            >
              <div className="history-item-left">
                <span className="history-tool-icon">
                  {toolIcons[item.tool]}
                </span>
                <div>
                  <div className="history-tool-name">
                    {item.tool.charAt(0).toUpperCase() + item.tool.slice(1)}
                  </div>
                  <div className="history-code-preview">
                    {item.code.slice(0, 30)}...
                  </div>
                </div>
              </div>
              <div className="history-item-right">
                <div className="history-time">
                  {formatTime(item.createdAt)}
                </div>
                <button
                  className="history-delete-btn"
                  onClick={e => handleDelete(e, item._id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HistoryPanel