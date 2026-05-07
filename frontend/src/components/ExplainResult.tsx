import { type ExplainResult as ExplainResultType } from "../types"

interface Props {
  data: ExplainResultType
}

const ExplainResult = ({ data }: Props) => {
  return (
    <>
      {/* Summary */}
      <div className="result-section">
        <div className="section-header">
          <span className="section-title">📝 Summary</span>
          <span className={`difficulty-badge difficulty-${data.difficulty}`}>
            {data.difficulty}
          </span>
        </div>
        <div className="section-body">
          <p className="explanation-text">{data.summary}</p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="result-section">
        <div className="section-header">
          <span className="section-title">🔍 Section Breakdown</span>
        </div>
        <div className="section-body">
          {data.breakdown.map((item, i) => (
            <div key={i} className="breakdown-item">
              <div className="breakdown-section">{item.section}</div>
              <div className="breakdown-text">{item.explanation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Concepts */}
      {data.concepts.length > 0 && (
        <div className="result-section">
          <div className="section-header">
            <span className="section-title">🧠 Concepts Used</span>
          </div>
          <div className="section-body">
            <div className="tags">
              {data.concepts.map((c, i) => (
                <span key={i} className="tag">{c}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ExplainResult