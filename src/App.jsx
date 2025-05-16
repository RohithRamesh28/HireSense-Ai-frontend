import React, { useState } from 'react';
import UploadMatchPage from './pages/ResumeUploader';
import ScoringPage from './pages/ScoringPage';
import './App.css';

export default function App() {
  const [tab, setTab] = useState('upload');
  const [uploadSubTab, setUploadSubTab] = useState('upload');
  const [uploadResults, setUploadResults] = useState({ upload: [], match: [] });
  const [scoringSubTab, setScoringSubTab] = useState('instant');
  const [scoringResults, setScoringResults] = useState({ instant: [], 'ats-jd': [], ats: [] });
  const [loading, setLoading] = useState(false);

return (
    <div className={`tab-wrapper ${tab === 'upload' ? 'upload-mode' : 'scoring-mode'}`}>
      <header>
        <h1>HireSense Ai</h1>
        <p>Match and Score Resumes Against Job Descriptions</p>
      </header>

      <div className="tab-buttons">
        <button
          onClick={() => !loading && setTab('upload')}
          disabled={loading}
          className={`upload-tab ${tab === 'upload' ? 'primary-btn' : ''}`}
        >
          Upload & Match
        </button>
        <button
          onClick={() => !loading && setTab('scoring')}
          disabled={loading}
          className={`scoring-tab ${tab === 'scoring' ? 'primary-btn' : ''}`}
        >
          ATS Scoring
        </button>
      </div>

      {tab === 'upload' && (
        <UploadMatchPage
          setLoading={setLoading}
          uploadSubTab={uploadSubTab}
          setUploadSubTab={setUploadSubTab}
          uploadResults={uploadResults}
          setUploadResults={setUploadResults}
          loading={loading} 
        />
      )}

      {tab === 'scoring' && (
        <ScoringPage
          setLoading={setLoading}
          scoringSubTab={scoringSubTab}
          setScoringSubTab={setScoringSubTab}
          scoringResults={scoringResults}
          setScoringResults={setScoringResults}
          loading={loading}
        />
      )}

      {loading && (
        <div className="loader-wrapper">
          <div className="spinner"></div>
          <p>Processing... Please wait.</p>
        </div>
      )}
    </div>
  );
}
