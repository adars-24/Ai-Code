import {type ComplexityResult as ComplexityResultType } from "../types"

interface Props {
  data: ComplexityResultType
}

const ComplexityResult = ({ data }: Props) => {
  return (
    <>
      {/* Complexity badges */}
      <div className="result-section">
        <div className="section-header">
          <span className="section-title">⏱ Complexity</span>
          <span className={`rating-badge rating-${data.rating}`}>
            {data.rating}
          </span>
        </div>
        <div className="section-body">
          <div className="complexity-grid">
            <div className="complexity-badge">
              <div className="complexity-label">Time</div>
              <div className="complexity-value">{data.timeComplexity}</div>
            </div>
            <div className="complexity-badge">
              <div className="complexity-label">Space</div>
              <div className="complexity-value">{data.spaceComplexity}</div>
            </div>
          </div>
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

      {/* Bottlenecks */}
      {data.bottlenecks.length > 0 && (
        <div className="result-section">
          <div className="section-header">
            <span className="section-title">🐌 Bottlenecks</span>
          </div>
          <div className="section-body">
            <div className="result-list">
              {data.bottlenecks.map((b, i) => (
                <div key={i} className="result-list-item">{b}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {data.suggestions.length > 0 && (
        <div className="result-section">
          <div className="section-header">
            <span className="section-title">🚀 Optimizations</span>
          </div>
          <div className="section-body">
            <div className="result-list">
              {data.suggestions.map((s, i) => (
                <div key={i} className="result-list-item">{s}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ComplexityResult