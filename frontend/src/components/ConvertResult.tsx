import {type ConvertResult as ConvertResultType } from "../types"

interface Props {
  data: ConvertResultType
  onCopy: (text: string) => void
}

const ConvertResult = ({ data, onCopy }: Props) => {
  return (
    <>
      {/* Converted code */}
      <div className="result-section">
        <div className="section-header">
          <span className="section-title">⚡ Converted Code</span>
          <button
            className="copy-btn"
            onClick={() => onCopy(data.convertedCode)}
          >
            📋 Copy
          </button>
        </div>
        <div className="section-body" style={{ padding: 0 }}>
          <pre style={{
            padding: "14px",
            fontSize: "12px",
            overflowX: "auto",
            margin: 0,
            fontFamily: "monospace",
            lineHeight: 1.6,
            color: "var(--text-primary)",
            background: "var(--bg-hover)"
          }}>
            {data.convertedCode}
          </pre>
        </div>
      </div>

      {/* Notes */}
      {data.notes.length > 0 && (
        <div className="result-section">
          <div className="section-header">
            <span className="section-title">📌 Conversion Notes</span>
          </div>
          <div className="section-body">
            <div className="result-list">
              {data.notes.map((note, i) => (
                <div key={i} className="result-list-item">{note}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {data.warnings.length > 0 && (
        <div className="result-section">
          <div className="section-header">
            <span className="section-title">⚠️ Warnings</span>
          </div>
          <div className="section-body">
            {data.warnings.map((w, i) => (
              <div key={i} className="warning-item">
                ⚠ {w}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ConvertResult