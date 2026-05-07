import {type DebugResult as DebugResultType } from "../types"

interface Props {
  data: DebugResultType
  onCopy: (text: string) => void
}

const DebugResult = ({ data, onCopy }: Props) => {
  return (
    <>
      {/* Errors section */}
      <div className="result-section">
        <div className="section-header">
          <span className="section-title">
            {data.hasErrors ? "⚠️ Issues Found" : "✅ No Issues"}
          </span>
          <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {data.errors.length} issue{data.errors.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="section-body">
          {data.hasErrors ? (
            data.errors.map((err, i) => (
              <div key={i} className={`error-card ${err.severity}`}>
                <div className="error-severity">{err.severity}</div>
                <div className="error-desc">{err.description}</div>
                {err.line && (
                  <div className="error-line">Line {err.line}</div>
                )}
              </div>
            ))
          ) : (
            <div className="no-errors">
              ✓ Code looks good — no issues detected
            </div>
          )}
        </div>
      </div>

      {/* Explanation */}
      <div className="result-section">
        <div className="section-header">
          <span className="section-title">💡 Explanation</span>
        </div>
        <div className="section-body">
          <p className="explanation-text">{data.explanation}</p>
        </div>
      </div>

      {/* Fixed code */}
      {data.hasErrors && (
        <div className="result-section">
          <div className="section-header">
            <span className="section-title">🔧 Fixed Code</span>
            <button
              className="copy-btn"
              onClick={() => onCopy(data.fixedCode)}
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
              {data.fixedCode}
            </pre>
          </div>
        </div>
      )}

      {/* Improvements */}
      {data.improvements.length > 0 && (
        <div className="result-section">
          <div className="section-header">
            <span className="section-title">🚀 Improvements</span>
          </div>
          <div className="section-body">
            <div className="result-list">
              {data.improvements.map((imp, i) => (
                <div key={i} className="result-list-item">{imp}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DebugResult