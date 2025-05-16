import React from 'react';

export default function ResultsTable({ results }) {
  if (!results || !results.length) return null;

  return (
    <div className="results-wrapper">
      <table className="results-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Score</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {results.map((row, i) => (
            <tr key={i}>
              <td>{row.name || 'N/A'}</td>
              <td>{row.email || 'N/A'}</td>
              <td>
                <span className={`score-badge ${getScoreClass(row.score * 10)}`}>
                  {(row.score * 10).toFixed(1)}
                  </span>
                  </td>
              <td>
                {row.id ? (
                  <a
                    href={`http://127.0.0.1:8070/view-resume/${row.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-link"
                  >
                    ↓ Download
                  </a>
                ) : (
                  <span className="download-link disabled">N/A</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getScoreClass(score) {
  if (score >= 80) return 'high';
  if (score >= 50) return 'mid';
  return 'low';
}
