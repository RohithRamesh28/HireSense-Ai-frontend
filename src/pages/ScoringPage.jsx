import React, { useState } from 'react';
import axios from '../api';
import FileListDisplay from '../components/FileListDisplay';
import ResultsTable from '../components/ResultsTable';

export default function ScoringPage({ setLoading, scoringSubTab, setScoringSubTab, scoringResults, setScoringResults, loading }) {
  const [mode, setMode] = useState('text');
  const [resumeFiles, setResumeFiles] = useState(null);
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_RESUME_TYPES = ['application/pdf'];
  const ALLOWED_JD_TYPES = ['application/pdf', 'text/plain'];

  const handleTabChange = (tab) => {
    if (loading) return;
    setScoringSubTab(tab);
    setScoringResults(prev => ({ ...prev, [tab]: [] }));
    setMessage({ type: '', text: '' });
  };

  const validateFiles = (files) => {
    const seen = new Set();
    for (let file of files) {
      if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
        setMessage({ type: 'error', text: `Unsupported file type: ${file.name}` });
        return false;
      }
      if (file.size === 0) {
        setMessage({ type: 'error', text: `File is empty: ${file.name}` });
        return false;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setMessage({ type: 'error', text: `File too large: ${file.name} (max ${MAX_FILE_SIZE_MB}MB)` });
        return false;
      }
      if (seen.has(file.name)) {
        setMessage({ type: 'error', text: `Duplicate file: ${file.name}` });
        return false;
      }
      seen.add(file.name);
    }
    return true;
  };

  const handleResumeChange = (e) => {
    const files = Array.from(e.target.files);
    if (validateFiles(files)) {
      setResumeFiles(files);
      setMessage({ type: '', text: '' });
    } else {
      e.target.value = null;
      setResumeFiles(null);
    }
  };

  const handleJDFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !ALLOWED_JD_TYPES.includes(file.type)) {
      setMessage({ type: 'error', text: `Unsupported JD file type: ${file.name}` });
      e.target.value = null;
      return;
    }
    if (file && file.size === 0) {
      setMessage({ type: 'error', text: `JD file is empty: ${file.name}` });
      e.target.value = null;
      return;
    }
    if (file && file.size > 1 * 1024 * 1024) {
      setMessage({ type: 'error', text: `JD file too large: ${file.name} (max 1MB)` });
      e.target.value = null;
      return;
    }
    setJdFile(file);
    setMessage({ type: '', text: '' });
  };

  const run = async () => {
    if (!resumeFiles || resumeFiles.length === 0) {
      setMessage({ type: 'error', text: 'Please select resume files.' });
      return;
    }

    const form = new FormData();
    let endpoint = '/ats-score/';
    if (scoringSubTab === 'instant') endpoint = '/instant-upload-match/';
    if (scoringSubTab === 'ats-jd') endpoint = '/ats-jd-score/';

    if (endpoint !== '/ats-score/') {
      form.append('mode', mode);
      if (mode === 'text' && !jdText.trim()) {
        setMessage({ type: 'error', text: 'Please enter JD text.' });
        return;
      }
      if (mode === 'pdf' && !jdFile) {
        setMessage({ type: 'error', text: 'Please select a JD file.' });
        return;
      }

      if (mode === 'text') form.append('text', jdText);
      else form.append('file', jdFile);
    }

    const key = endpoint === '/ats-jd-score/' ? 'resumes' : 'files';
    resumeFiles.forEach(f => form.append(key, f));

    setScoringResults(prev => ({ ...prev, [scoringSubTab]: [] }));
    setLoading(true);
    setMessage({ type: 'info', text: 'Scoring resumes. Please wait...' });

    try {
      const { data } = await axios.post(endpoint, form);
      setScoringResults(prev => ({ ...prev, [scoringSubTab]: data.matches }));
      setMessage({ type: 'success', text: 'Scoring completed!' });
    } catch {
      setMessage({ type: 'error', text: 'Scoring failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <div className="sub-tab-buttons">
        <button onClick={() => handleTabChange('instant')} disabled={loading} className={`sub-tab-instant ${scoringSubTab === 'instant' ? 'primary-btn' : ''}`}>
          Instant Match
        </button>
        <button onClick={() => handleTabChange('ats-jd')} disabled={loading} className={`sub-tab-atsjd ${scoringSubTab === 'ats-jd' ? 'primary-btn' : ''}`}>
          ATS + JD
        </button>
        <button onClick={() => handleTabChange('ats')} disabled={loading} className={`sub-tab-ats ${scoringSubTab === 'ats' ? 'primary-btn' : ''}`}>
          ATS Only
        </button>
      </div>

      {message.text && (
        <div className={`banner ${message.type}`}>
          {message.text}
        </div>
      )}

   <div className="form-group">
  <label>Resumes:</label>

  <div className="upload-controls">
    <label className="custom-file-upload">
      📁 Choose Resume PDFs
      <input type="file" multiple accept=".pdf" onChange={handleResumeChange} />
    </label>
  </div>

  <FileListDisplay files={resumeFiles} />
</div>


      {scoringSubTab !== 'ats' && (
        <div className="form-group">
          <label>Job Description:</label>
          <div className="flex-row">
            <select value={mode} onChange={e => setMode(e.target.value)} className="input">
              <option value="text">Text</option>
              <option value="pdf">PDF</option>
            </select>
            {mode === 'text' ? (
              <textarea value={jdText} onChange={e => setJdText(e.target.value)} placeholder="Paste JD here..." rows={5} className="input" />
            ) : (
              <input type="file" accept=".pdf,.txt" onChange={handleJDFileChange} className="input" />
            )}
          </div>
        </div>
      )}

      <button onClick={run} className="upload-btn">Run</button>

      {!loading && scoringResults[scoringSubTab]?.length > 0 && (
        <ResultsTable results={scoringResults[scoringSubTab]} />
      )}
    </div>
  );
}
